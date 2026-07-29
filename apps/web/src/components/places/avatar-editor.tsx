import { sendRequest } from '@/lib/api/fetchers';
import { dispatch, useSante } from '@/lib/store';
import { cropAndResize } from '@/lib/utils-client';
import { useCallback, useEffect } from 'react';
import Button from '../common/button';
import Crop from './crop';

export default function AvatarEditor({ src, onComplete }: { src: string; onComplete: () => void }) {
  const { crops } = useSante(['crops']);

  useEffect(() => {
    dispatch('aspect', 1);

    return () => {
      dispatch('aspect', null);
      dispatch('crops', null);
    };
  }, []);

  const onCancel = useCallback(onComplete, [onComplete]);

  const onSave = useCallback(() => {
    if (crops) {
      const img = document.createElement('img');

      img.onload = async () => {
        const cropInfo = crops[0];
        if (cropInfo == null) {
          return;
        }

        const cropped = await cropAndResize(img, cropInfo, 240);

        const form = new FormData();
        form.append('avatar', new File([cropped], 'avatar.jpg', { type: 'image/jpeg' }));

        const res = await sendRequest({ method: 'PUT', url: '/places/users/avatar', data: form });
        if (res.status === 200 && res.data) {
          dispatch('userInfo', (p) => (p ? { ...p, avatar: res.data.avatar } : p));
          onComplete();
        }
      };

      img.src = src;
    }
  }, [crops, onComplete, src]);

  return (
    <>
      <div className="crop-container flex justify-center items-center">
        <Crop src={src} index={0} circular={true} min={240} />
      </div>

      <div className="flex justify-center space-x-2 mt-3">
        <Button color="zinc" size="xs" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="indigo" size="xs" onClick={onSave}>
          Save
        </Button>
      </div>
      <style jsx>{`
        .crop-container {
          height: 240px;
        }
      `}</style>
    </>
  );
}
