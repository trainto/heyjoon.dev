'use client';

import { useSante } from '@/lib/store';
import { ReactNode, useEffect } from 'react';
import Layer from '../common/layer';
import Modal from './modal';

export default function Layout({ children }: { children: ReactNode }) {
  const { layer, modal } = useSante(['layer', 'modal']);

  useEffect(() => {
    const body = document.querySelector('body');
    if (layer || modal) {
      body?.classList.add('overflow-hidden');
    } else {
      body?.classList.remove('overflow-hidden');
    }
  }, [layer, modal]);

  return (
    <>
      {children}

      {layer && <Layer containerClassName={layer.containerClassName ?? ''}>{layer.node}</Layer>}

      {modal && (
        <div className="modal-container">
          <div className="flex justify-center w-full modal-window">
            <Modal />
          </div>
        </div>
      )}
    </>
  );
}
