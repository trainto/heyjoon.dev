'use client';

import Layer from '@/components/common/layer';
import Modal from '@/components/places/modal';
import { useSante } from '@/lib/store';

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  const { layer, modal } = useSante(['layer', 'modal']);

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
