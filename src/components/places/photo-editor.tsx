import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Button from '../button';
import Crop from './crop';
import { dispatch } from '@/lib/store';
import { imgToDataURL, resizeImages } from '@/lib/utils-client';
import { IMAGE_SIZE } from '@/lib/constants';
import { dispatchEvent } from '@/lib/event-bus';

export default function PhotoEditor({
  files,
  onComplete,
}: {
  files: File[];
  onComplete: (blobs: Blob[]) => void;
}) {
  const [originalUrls, setOriginalUrls] = useState<string[]>([]);
  const [croppedUrls, setCroppedUrls] = useState<string[]>([]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [smallImages, setSmallImages] = useState<number[]>([]);

  useEffect(() => {
    files.map(async (f, i) => {
      const url = await imgToDataURL(f);

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

  const handleOrdering = (e: React.MouseEvent<HTMLDivElement>, from: number, to: number) => {
    e.stopPropagation();

    if (to < 0 || to > originalUrls.length - 1) {
      return;
    }

    setOriginalUrls((p) => {
      const temp = p[from];
      p[from] = p[to];
      p[to] = temp;

      return [...p];
    });
  };

  const onCrop = useCallback(
    (dataUrl: string) => {
      setCroppedUrls((p) => {
        p[targetIndex] = dataUrl;
        return [...p];
      });
    },
    [targetIndex],
  );

  const onDone = useCallback(async () => {
    const images = originalUrls.map((u, i) => (croppedUrls[i] ? croppedUrls[i] : u));
    const resized = await resizeImages(images);
    onComplete(resized);
    dispatch('layer', null);
  }, [croppedUrls, onComplete, originalUrls]);

  return (
    <div>
      <div
        className={`relative bg-black pt-100 rounded-md ${
          smallImages.includes(targetIndex) ? 'border border-red-900' : ''
        }`}
      >
        <div className="crop-container absolute top-0 bottom-0 left-0 right-0 grid place-content-center">
          {ready &&
            (croppedUrls[targetIndex] ? (
              <Image
                src={croppedUrls[targetIndex]}
                fill={true}
                style={{ objectFit: 'contain' }}
                alt="Cropped"
              />
            ) : (
              <Crop src={originalUrls[targetIndex]} onCrop={onCrop} />
            ))}
        </div>
      </div>
      {smallImages.includes(targetIndex) ? (
        <div className="py-1 text-red-700 text-xs text-center">This image is too small!!</div>
      ) : (
        <div className="bg-black flex justify-center space-x-2 py-1">
          <Button
            color="zinc"
            size="sm"
            onClick={() =>
              setCroppedUrls((p) => {
                delete p[targetIndex];
                return [...p];
              })
            }
          >
            Revert
          </Button>
          <Button color="indigo" size="sm" onClick={() => dispatchEvent('cropClicked')}>
            Crop
          </Button>
        </div>
      )}

      <div className="flex space-x-3 mt-3 py-3 border-t border-gray-500 overflow-auto">
        {originalUrls.map((url, i) => (
          <div
            key={i}
            className="relative rounded-md bg-black cursor-pointer"
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

            <div className="flex justify-between px-2 font-bold text-brand2">
              <div
                role="button"
                className={i === 0 ? 'text-gray-500' : ''}
                onClick={(e) => handleOrdering(e, i, i - 1)}
              >{`<`}</div>
              <div
                role="button"
                className={i >= originalUrls.length - 1 ? 'text-gray-500' : ''}
                onClick={(e) => handleOrdering(e, i, i + 1)}
              >{`>`}</div>
            </div>

            <div className="absolute top-0 left-0 text-xs font-bold bg-brand1 rounded-full px-1">
              {i + 1}
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
