import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Button from '../button';
import Crop from './crop';
import { dispatch } from '@/lib/store';
import { fileToDataURL, resizeImages } from '@/lib/utils-client';
import { IMAGE_SIZE } from '@/lib/constants';

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
  const [smallImages, setSmallImages] = useState<number[]>([]);

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
    // const resized = originalUrls.map((u) => dataURItoBlob(u));
    onComplete(resized);
    dispatch('layer', null);
  }, [onComplete, originalUrls]);

  return (
    <div>
      <div
        className={`relative bg-black pt-100 rounded-md ${
          smallImages.includes(targetIndex) ? 'border border-red-900' : ''
        }`}
      >
        <div className="crop-container absolute top-0 bottom-0 left-0 right-0 grid place-content-center">
          {ready && <Crop src={originalUrls[targetIndex]} />}
        </div>
      </div>
      {smallImages.includes(targetIndex) ? (
        <div className="py-1 text-red-700 text-xs text-center">This image is too small!!</div>
      ) : (
        <div className="bg-black flex justify-center space-x-2 py-1">
          <Button color="zinc" size="sm" onClick={() => null}>
            Revert
          </Button>
          <Button color="indigo" size="sm" onClick={() => null}>
            Crop
          </Button>
        </div>
      )}

      <div className="flex space-x-3 mt-3 py-3 border-t border-gray-500 overflow-auto">
        {originalUrls.map((url, i) => (
          <div
            key={i}
            className="rounded-md bg-black cursor-pointer"
            role="button"
            onClick={() => setTargetIndex(i)}
          >
            <div className="relative bg-black w-20 pt-100 rounded-md">
              <div className="grid content-center absolute top-0 bottom-0 left-0 right-0 rounded-md">
                {ready && (
                  <Image
                    src={url}
                    fill={true}
                    style={{ objectFit: 'contain' }}
                    alt={files[i].name}
                    onLoad={(e) => {
                      if (
                        (e.target as HTMLImageElement).naturalWidth < IMAGE_SIZE ||
                        (e.target as HTMLImageElement).naturalHeight < IMAGE_SIZE
                      ) {
                        setSmallImages((prev) => [...prev, i]);
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end border-t border-gray-500 py-2">
        <Button color="indigo" onClick={onDone}>
          Upload
        </Button>
      </div>
    </div>
  );
}
