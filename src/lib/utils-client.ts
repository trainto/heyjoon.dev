import { Crop } from 'react-image-crop';
import { IMAGE_SIZE } from './constants';

export const Storage = (() => {
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

export const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};

export const resizeImages = (
  files: (string | File)[],
  maxWidth = IMAGE_SIZE,
  maxHeight = IMAGE_SIZE,
) => {
  return new Promise<Blob[]>((resolve) => {
    const ret: Blob[] = [];

    files.forEach(async (item, i) => {
      const img: HTMLImageElement = document.createElement('img');

      img.onload = () => {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingQuality = 'high';
        }

        let width = 0;
        let height = 0;

        if (img.naturalWidth === img.naturalHeight) {
          width = maxWidth;
          height = maxHeight;
        } else if (img.naturalWidth > img.naturalHeight) {
          width = maxWidth;
          height = (img.naturalHeight * width) / img.naturalWidth;
        } else {
          height = maxHeight;
          width = (img.naturalWidth * height) / img.naturalHeight;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataURI = canvas.toDataURL('image/jpeg', 1);

        ret[i] = dataURItoBlob(dataURI);

        if (ret.length === files.length) {
          for (let i = 0; i < files.length; i += 1) {
            if (!ret[i]) {
              return;
            }
          }

          resolve(ret);
        }
      };

      img.src = typeof item === 'string' ? item : await imgToDataURL(item);
    });
  });
};

export const cropImage = async (img: HTMLImageElement, crop: Crop) => {
  const scaleX = img.naturalWidth / img.width;
  const scaleY = img.naturalHeight / img.height;
  const pixelRatio = window.devicePixelRatio;

  const canvasWidth = Math.floor(crop.width * scaleX * pixelRatio);
  const canvasHeight = Math.floor(crop.height * scaleY * pixelRatio);

  const canvas = new OffscreenCanvas(
    canvasWidth < IMAGE_SIZE ? IMAGE_SIZE : canvasWidth,
    canvasHeight < IMAGE_SIZE ? IMAGE_SIZE : canvasHeight,
  );
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

  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 1 });
  const dataUrl = await imgToDataURL(blob);

  return dataUrl;
};
