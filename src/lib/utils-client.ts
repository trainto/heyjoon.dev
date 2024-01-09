import { Crop } from 'react-image-crop';
import { IMAGE_SIZE } from './constants';

export const storage = (() => {
  type Key = 'isLogin';

  const which = (which: 'local' | 'session') => {
    if (typeof window === 'undefined') {
      return null;
    }

    if (which === 'session') {
      return sessionStorage;
    } else {
      return localStorage;
    }
  };

  const set = (
    key: Key,
    value: string | number | boolean | Record<string, unknown>,
    storage: 'local' | 'session' = 'local',
  ) => {
    which(storage)?.setItem(key, JSON.stringify(value));
  };

  const get = (key: Key, storage: 'local' | 'session' = 'local') => {
    return which(storage)?.getItem(key) || undefined;
  };

  const remove = (key: Key, storage: 'local' | 'session' = 'local') => {
    return which(storage)?.removeItem(key);
  };

  return {
    set,
    get,
    remove,
  };
})();

export const imgToDataURL = (file: File | Blob) => {
  return new Promise<string>((resolve) => {
    const fr = new FileReader();

    fr.onload = (e) => {
      resolve(e.target?.result as string);
    };

    fr.readAsDataURL(file);
  });
};

export const resize = (img: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No 2d context');
  }

  ctx.imageSmoothingQuality = 'high';

  let width = 0;
  let height = 0;

  if (img.naturalWidth === img.naturalHeight) {
    width = IMAGE_SIZE;
    height = IMAGE_SIZE;
  } else if (img.naturalWidth > img.naturalHeight) {
    width = IMAGE_SIZE;
    height = (img.naturalHeight * width) / img.naturalWidth;
  } else {
    height = IMAGE_SIZE;
    width = (img.naturalWidth * height) / img.naturalHeight;
  }

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject()), 'image/jpeg', 0.95);
  });
};

export const cropAndResize = (img: HTMLImageElement, crop: Crop & CropInfo, resize?: number) => {
  const scaleX = crop.scaleX;
  const scaleY = crop.scaleY;
  const pixelRatio = window.devicePixelRatio;

  const canvasWidth = Math.floor(crop.width * scaleX * pixelRatio);
  const canvasHeight = Math.floor(crop.height * scaleY * pixelRatio);

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No 2d context');
  }

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const centerX = img.naturalWidth / 2;
  const centerY = img.naturalHeight / 2;

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.translate(-cropX, -cropY);
  ctx.translate(centerX, centerY);
  ctx.translate(-centerX, -centerY);

  ctx.drawImage(
    img,
    0,
    0,
    img.naturalWidth,
    img.naturalHeight,
    0,
    0,
    img.naturalWidth,
    img.naturalHeight,
  );

  // Resize
  const size = resize ? resize : IMAGE_SIZE;
  const canvasResize = document.createElement('canvas');
  canvasResize.width = canvasWidth > canvasHeight ? size : (size * canvasWidth) / canvasHeight;
  canvasResize.height = canvasHeight > canvasWidth ? size : (size * canvasHeight) / canvasWidth;

  const ctxResize = canvasResize.getContext('2d');
  if (!ctxResize) {
    throw new Error('No 2d context');
  }

  ctxResize.drawImage(canvas, 0, 0, canvasResize.width, canvasResize.height);

  return new Promise<Blob>((resolve, reject) => {
    canvasResize.toBlob((blob) => (blob ? resolve(blob) : reject()), 'image/jpeg', 0.95);
  });
};
