import { createSante } from '@trainto/sante';
import { ReactNode } from 'react';
import { Crop } from 'react-image-crop';

type Store = {
  userInfo: UserInfo | null;
  layer: { node: ReactNode; containerClassName?: string } | null;
  modal: { msg: string; onConfirm?: () => void; hasCancel?: boolean } | null;
  aspect: number | null;
  crops: ((Crop & CropInfo) | undefined)[] | null;
};

const initialStore: Store = {
  userInfo: null,
  layer: null,
  modal: null,
  aspect: null,
  crops: null,
};

const { useSante, dispatch } = createSante(initialStore);

export { dispatch, useSante };
