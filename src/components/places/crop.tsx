/* eslint-disable @next/next/no-img-element */

import ReactCrop, { type Crop } from 'react-image-crop';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import 'react-image-crop/dist/ReactCrop.css';
import { useResize } from '@/lib/hooks';

const Crop = ({ src }: { src: string }) => {
  const [crop, setCrop] = useState<Crop>();
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    setCrop(undefined);
  }, [src]);

  useResize(() => {
    const cropContainer = document.querySelector('.crop-container');
    if (cropContainer) {
      setMaxHeight(cropContainer.clientHeight);
    }
  }, true);

  return (
    <>
      <ReactCrop
        crop={crop}
        onChange={(_c, p) => {
          setCrop(p);
        }}
        style={{ maxHeight }}
      >
        <img src={src} alt="Image to crop" />
      </ReactCrop>
    </>
  );
};

export default Crop;
