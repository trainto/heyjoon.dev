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

export const fileToDataURL = (file: File) => {
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
        const dataURI = canvas.toDataURL('image/jpeg');

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

      img.src = typeof item === 'string' ? item : await fileToDataURL(item);
    });
  });
};
