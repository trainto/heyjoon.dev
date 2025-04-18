import { IMAGE_SIZE } from '@/lib/constants';
import { dispatch, useSante } from '@/lib/store';
import { cropAndResize, imgToDataURL, resize } from '@/lib/utils-client';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Button from '../common/button';
import Crop from './crop';
import Loading from './loading';

export default function PhotoEditor({
  files,
  onComplete,
}: {
  files: File[];
  onComplete: (blobs: Blob[]) => void;
}) {
  const [urls, setUrls] = useState<string[]>([]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [smallImages, setSmallImages] = useState<number[]>([]);
  const [processingImgs, setProcessingImgs] = useState(false);

  const { crops, aspect } = useSante(['crops', 'aspect']);

  useEffect(() => {
    files.map(async (f, i) => {
      const url = await imgToDataURL(f);

      setUrls((prev) => {
        prev[i] = url;
        return [...prev];
      });
    });
  }, [files]);

  useEffect(() => {
    if (urls.length !== files.length) {
      return;
    }

    let check = true;
    for (let i = 0; i < files.length; i += 1) {
      if (!urls[i]) {
        check = false;
        break;
      }
    }

    if (check) {
      setReady(true);
    }
  }, [files.length, urls]);

  const handleOrdering = (e: React.MouseEvent<HTMLDivElement>, from: number, to: number) => {
    e.stopPropagation();
    {
    }
    if (to < 0 || to > urls.length - 1) {
      return;
    }

    setUrls((p) => {
      const temp = p[from];
      p[from] = p[to];
      p[to] = temp;

      return [...p];
    });

    dispatch('crops', (p) => {
      if (p == null) {
        return p;
      }

      const temp = p[from];
      p[from] = p[to];
      p[to] = temp;

      return [...p];
    });
  };

  const onCompleteClicked = useCallback(() => {
    setProcessingImgs(true);
    setTimeout(() => {
      const imgs: HTMLImageElement[] = [];
      urls.forEach((_u, i) => {
        const img = document.querySelector<HTMLImageElement>('#image-' + i);
        if (img) {
          imgs[i] = img;
        }
      });

      const resized: Blob[] = [];
      urls.forEach(async (_url, i) => {
        if (crops && crops[i]) {
          resized[i] = await cropAndResize(imgs[i], crops[i]!);
        } else {
          resized[i] = await resize(imgs[i]);
        }

        if (resized.length === urls.length) {
          for (let i = 0; i < resize.length; i += 1) {
            if (resized[i] == null) {
              return;
            }
          }

          onComplete(resized);
          dispatch('layer', null);
          dispatch('crops', null);
        }
      });
    }, 0);
  }, [crops, onComplete, urls]);

  return (
    <div>
      <div
        className={`relative bg-black pt-100 ${
          smallImages.includes(targetIndex) ? 'border border-red-900' : ''
        }`}
      >
        <div className="crop-container absolute top-0 bottom-0 left-0 right-0 grid place-content-center">
          {ready && <Crop src={urls[targetIndex]} index={targetIndex} />}
        </div>
      </div>
      {smallImages.includes(targetIndex) ? (
        <div className="py-1 text-red-700 text-xs text-center">This image is too small!!</div>
      ) : (
        <div className="bg-black flex py-1 justify-center space-x-3 text-gray-300">
          <div
            role="button"
            className={`font-bold text-sm border border-dashed rounded-md px-2 ${
              aspect === 1 ? 'border-brand2' : 'border-gray-400 text-gray-500'
            }`}
            onClick={() => dispatch('aspect', 1)}
          >
            1 : 1
          </div>
          <div
            role="button"
            className={`font-bold text-sm border border-dashed rounded-md px-2 ${
              aspect === 4 / 3 ? 'border-brand2' : 'border-gray-400 text-gray-500'
            }`}
            onClick={() => dispatch('aspect', 4 / 3)}
          >
            4 : 3
          </div>
        </div>
      )}

      <div className="flex space-x-3 mt-3 py-3 border-t border-gray-500 overflow-auto">
        {urls.map((url, i) => (
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
                    id={`image-${i}`}
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
                className={i >= urls.length - 1 ? 'text-gray-500' : ''}
                onClick={(e) => handleOrdering(e, i, i + 1)}
              >{`>`}</div>
            </div>

            <div className="absolute top-0 left-0 text-xs font-bold bg-brand1 rounded-full px-1">
              {i + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end py-2">
        {processingImgs ? (
          <Loading />
        ) : (
          <Button color="indigo" onClick={onCompleteClicked}>
            Complete
          </Button>
        )}
      </div>
    </div>
  );
}
