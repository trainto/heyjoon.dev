import { IMAGE_SIZE } from '@/lib/constants';
import { useResize } from '@/lib/hooks';
import useStore from '@/lib/store';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';

const Crop = ({
  src,
  index,
  circular,
  min,
}: {
  src: string;
  index: number;
  circular?: boolean;
  min?: number;
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [maxHeight, setMaxHeight] = useState(0);
  const [minSize, setMinSize] = useState(0);

  const { value: aspect, dispatch: dispatchAspect } = useStore('aspect');
  const { value: crops, dispatch: dispatchCrop } = useStore('crops');

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    dispatchAspect(null);
  }, [dispatchAspect, index]);

  useEffect(() => {
    if (crops && crops[index]) {
      setCrop(crops[index]);
    } else {
      setCrop(undefined);
    }
  }, [crops, index]);

  useResize(() => {
    const cropContainer = document.querySelector('.crop-container');
    if (cropContainer) {
      setMaxHeight(cropContainer.clientHeight);
    }
  }, true);

  const onDragStart = useCallback(() => {
    if (!aspect) {
      dispatchAspect(1);
    }
  }, [aspect, dispatchAspect]);

  const onDragEnd = useCallback(() => {
    if (crop?.width === 0 || crop?.height === 0) {
      setCrop(undefined);
    }
  }, [crop?.height, crop?.width, setCrop]);

  const onComplete = useCallback(
    (crop: Crop) => {
      dispatchCrop((p) => {
        const ret = p ? [...p] : [];
        ret[index] = crop
          ? Object.assign(crop, {
              scaleX: imgRef.current ? imgRef.current.naturalWidth / imgRef.current.width : 1,
              scaleY: imgRef.current ? imgRef.current.naturalHeight / imgRef.current.height : 1,
            })
          : crop;

        return ret;
      });
    },
    [dispatchCrop, index],
  );

  const handleImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (crop) {
      return;
    }

    const initCrop = (elem: HTMLImageElement) => {
      const { width, height, naturalWidth } = elem;

      const minSize = (width * (min ? min : IMAGE_SIZE)) / naturalWidth;
      setMinSize(minSize);

      const dimension = width > height ? height : width;

      setCrop({
        x: width > height ? (width - height) / 2 : 0,
        y: width > height ? 0 : (height - width) / 2,
        width: dimension,
        height: dimension,
        unit: 'px',
      });
    };

    const checkLoadedAndTryCrop = (elem: HTMLImageElement) => {
      setTimeout(() => {
        if (elem.width === 0) {
          checkLoadedAndTryCrop(elem);
        } else {
          initCrop(elem);
        }
      }, 100);
    };

    checkLoadedAndTryCrop(e.currentTarget);
  };

  return (
    <ReactCrop
      crop={crop}
      aspect={aspect == null ? undefined : aspect}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onChange={setCrop}
      onComplete={onComplete}
      style={{ maxHeight }}
      minWidth={minSize}
      minHeight={minSize}
      circularCrop={circular}
    >
      <img src={src} alt="Image to crop" ref={imgRef} onLoad={handleImageLoaded} />
    </ReactCrop>
  );
};

export default Crop;
