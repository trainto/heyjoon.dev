import { sendRequest } from '@/lib/api/fetchers';
import { dispatchEvent } from '@/lib/event-bus';
import { dispatch, useSante } from '@/lib/store';
import Image from 'next/image';
import { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Button from '../common/button';
import Avatar from './avatar';
import Loading from './loading';
import PhotoEditor from './photo-editor';
import { DescField, LocationField } from './place-fields';
import { Camera } from './svg';

const Uploader = () => {
  const [desc, setDesc] = useState('');
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [location, setLocation] = useState<PlaceLocation | null>(null);

  const { userInfo, layer } = useSante(['userInfo', 'layer']);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (layer == null) {
      dispatch('crops', []);
    }
  }, [layer]);

  const handleImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = [];
      for (let i = 0; i < e.target.files.length; i += 1) {
        const file = e.target.files.item(i);
        if (file) {
          files.push(file);
        }
      }

      dispatch('layer', {
        node: <PhotoEditor files={files} onComplete={setBlobs} />,
        containerClassName: 'w-full sm:w-1/3',
      });
    }
    e.target.value = '';
  };

  const handlePost = useCallback(async () => {
    if (desc.trim() === '') {
      setIsUploading(false);
      return;
    }

    const form = new FormData();
    form.append('desc', desc.trim());
    if (location) {
      form.append('location', JSON.stringify(location));
    }
    blobs.forEach((b, i) =>
      form.append('files', new File([b], i + '.jpg', { type: 'image/jpeg' }))
    );

    const res = await sendRequest({
      method: 'post',
      url: '/places',
      data: form,
    });

    if (res.status === 200) {
      setDesc('');
      setBlobs([]);
      setLocation(null);
      dispatchEvent('fetchPlaces');
    } else {
      dispatch('modal', { msg: 'Failed to post. Please try again.' });
    }

    setIsUploading(false);
  }, [blobs, desc, location]);

  useEffect(() => {
    if (isUploading) {
      handlePost();
    }
  }, [handlePost, isUploading]);

  if (userInfo == null) {
    return null;
  }

  return (
    <div className="border border-gray-700 p-3 rounded mb-4">
      <div className="flex space-x-2">
        <div>
          <Avatar src={userInfo.avatar} size={36} nickname={userInfo.nickname} />
        </div>

        <div className="flex-grow">
          <DescField desc={desc} onDescChange={setDesc} />
        </div>
      </div>

      <div className="flex justify-between mt-3 h-9 border-t border-gray-600 ml-12 pt-2">
        <div className="flex space-x-2 items-end">
          <div className="cursor-pointer" role="button" onClick={() => inputRef.current?.click()}>
            <Camera />
          </div>
          {blobs && <div className="text-xs text-gray-300">{blobs.length}/10</div>}
          <LocationField location={location} onLocationChange={setLocation} />
        </div>

        {isUploading ? (
          <div className="px-4 pt-1">
            <Loading size={5} />
          </div>
        ) : (
          <Button
            size="sm"
            color="indigo"
            onClick={() => {
              if (!location) {
                dispatch('modal', {
                  msg: 'No location was added. Continue without it?',
                  hasCancel: true,
                  onConfirm: () => setIsUploading(true),
                });
                return;
              }

              setIsUploading(true);
            }}
            disabled={desc.trim() === '' || blobs.length === 0}
          >
            Post
          </Button>
        )}
      </div>

      {blobs && blobs.length > 0 && (
        <div className="mt-3 ml-12 h-10">
          <Swiper slidesPerView="auto" className="h-10" spaceBetween={5}>
            {blobs.map((blob, i) => (
              <SwiperSlide key={i} style={{ width: 'auto' }}>
                <Image
                  src={URL.createObjectURL(blob)}
                  alt="food"
                  width={40}
                  height={40}
                  className="rounded-md"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <div className="hidden">
        <input type="file" ref={inputRef} accept="image/jpeg" onChange={handleImages} multiple />
      </div>
    </div>
  );
};

export default memo(Uploader);
