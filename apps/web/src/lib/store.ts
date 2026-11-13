import { createSante } from '@trainto/sante';
import { ReactNode } from 'react';
import { Crop } from 'react-image-crop';

type Store = {
  userInfo: UserInfo | null;
  layer: { node: ReactNode; containerClassName?: string; key?: string } | null;
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

const { useSante, dispatch, dispatchMany, getCached } = createSante(initialStore);

export { dispatch, dispatchMany, getCached, useSante };
