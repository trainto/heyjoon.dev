import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Button from '../button';
import Crop from './crop';
import { dispatch } from '@/lib/store';
import { fileToDataURL, resizeImages } from '@/lib/utils-client';

export default function PhotoEditor({
  files,
  onComplete,
}: {
  files: File[];
  onComplete: (blobs: Blob[]) => void;
}) {
  const [originalUrls, setOriginalUrls] = useState<string[]>([]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    files.map(async (f, i) => {
      const url = await fileToDataURL(f);

      setOriginalUrls((prev) => {
        prev[i] = url;
        return [...prev];
      });
    });
  }, [files]);

  useEffect(() => {
    let check = true;
    for (let i = 0; i < files.length; i += 1) {
      if (!originalUrls[i]) {
        check = false;
        break;
      }
    }

    if (check) {
      setReady(true);
    }
  }, [files.length, originalUrls]);

  const onDone = useCallback(async () => {
    const resized = await resizeImages(originalUrls);
    onComplete(resized);
    dispatch('layer', null);
  }, [onComplete, originalUrls]);

  return (
    <div>
      <div className="relative bg-black w-100 pt-75p">
        <div className="crop-container absolute top-0 bottom-0 left-0 right-0 grid place-content-center">
          {ready && <Crop src={originalUrls[targetIndex]} />}
        </div>
      </div>
      <div className="bg-black flex justify-center">
        <Button color="indigo" onClick={() => null}>
          Crop
        </Button>
      </div>

      <div className="flex space-x-3 mt-3 py-3 border-t border-gray-500 overflow-auto">
        {originalUrls.map((url, i) => (
          <div
            key={i}
            className="rounded-md bg-black cursor-pointer"
            role="button"
            onClick={() => setTargetIndex(i)}
          >
            <div className="relative bg-black w-20 pt-75p rounded-md">
              <div className="grid content-center absolute top-0 bottom-0 left-0 right-0 rounded-md">
                {ready && (
                  <Image
                    className="rounded-md"
                    src={url}
                    fill={true}
                    style={{ objectFit: 'contain' }}
                    alt={files[i].name}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end border-t border-gray-500 py-2">
        <Button color="indigo" onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  );
}
