/* eslint-disable @next/next/no-img-element */

import ReactCrop, { type Crop } from 'react-image-crop';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useResize } from '@/lib/hooks';
import { IMAGE_SIZE } from '@/lib/constants';
import { useEventBus } from '@/lib/event-bus';
import { cropImage } from '@/lib/utils-client';

import 'react-image-crop/dist/ReactCrop.css';

const Crop = ({ src, onCrop }: { src: string; onCrop: (datUrl: string) => void }) => {
  const [crop, setCrop] = useState<Crop>();
  const [maxHeight, setMaxHeight] = useState(0);
  const [minSize, setMinSize] = useState(0);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCrop(undefined);
  }, [src]);

  useResize(() => {
    const cropContainer = document.querySelector('.crop-container');
    if (cropContainer) {
      setMaxHeight(cropContainer.clientHeight);
    }
  }, true);

  // To calc minimum width and height
  const handleDragStart = useCallback(() => {
    if (imgRef.current == null) {
      return;
    }

    setMinSize((imgRef.current.width * IMAGE_SIZE) / imgRef.current.naturalWidth);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (crop?.width === 0 || crop?.height === 0) {
      setCrop(undefined);
    }
  }, [crop]);

  const doCrop = useCallback(async () => {
    if (crop == null || imgRef.current == null) {
      return;
    }
    const dataUrl = await cropImage(imgRef.current, crop);
    onCrop(dataUrl);
  }, [crop, onCrop]);

  useEventBus('cropClicked', doCrop);

  return (
    <ReactCrop
      crop={crop}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onChange={setCrop}
      style={{ maxHeight }}
      minWidth={minSize}
      minHeight={minSize}
    >
      <img src={src} alt="Image to crop" ref={imgRef} />
    </ReactCrop>
  );
};

export default Crop;
