import { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import Avatar from './avatar';
import useStore from '@/lib/store';
import Button from '../button';
import { sendRequest } from '@/lib/api/fetchers';
import { dispatchEvent } from '@/lib/event-bus';
import Loading from './loading';

const Uploader = () => {
  const [desc, setDesc] = useState('');
  const [taRows, setTaRows] = useState(2);
  const [isUploading, setIsUploading] = useState(false);

  const { value: userInfo } = useStore('userInfo');

  const taRef = useRef<HTMLTextAreaElement>(null);

  const handleDescChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(e.target.value.slice(0, 180));

    const ta = taRef.current;
    if (ta == null) {
      return;
    }

    if (ta.clientHeight < ta.scrollHeight) {
      setTaRows((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (desc === '') {
      setTaRows(2);
    }
  }, [desc]);

  const handlePost = useCallback(async () => {
    if (desc.trim() === '') {
      setIsUploading(false);
      return;
    }

    const res = await sendRequest({
      method: 'post',
      url: '/places',
      data: { desc: desc.trim() },
    });

    if (res.status === 200) {
      setDesc('');
      dispatchEvent('fetchPlaces');
    }

    setIsUploading(false);
  }, [desc]);

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
          <textarea
            ref={taRef}
            className="bg-transparent w-full px-2"
            placeholder="Where do you want to share?"
            maxLength={180}
            value={desc}
            rows={taRows}
            onChange={handleDescChange}
          />
        </div>

        <div className="self-end text-xs text-gray-400">{desc.length}/180</div>
      </div>

      <div className="flex justify-end mt-3 h-7">
        {isUploading ? (
          <div className="px-4 pt-1">
            <Loading size={5} />
          </div>
        ) : (
          <Button
            size="sm"
            color="indigo"
            onClick={() => {
              setIsUploading(true);
            }}
          >
            Post
          </Button>
        )}
      </div>

      <style jsx>{`
        textarea {
          resize: none;
        }

        textarea:focus {
          outline: none !important;
        }
      `}</style>
    </div>
  );
};

export default memo(Uploader);
