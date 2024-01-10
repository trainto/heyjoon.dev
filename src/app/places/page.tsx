'use client';

import Layer from '@/components/layer';
import Feed from '@/components/places/feed';
import Modal from '@/components/places/modal';
import Side from '@/components/places/side';
import useStore from '@/lib/store';
import { useEffect } from 'react';

export default function Places() {
  const { value: layer } = useStore('layer');
  const { value: modal } = useStore('modal');

  useEffect(() => {
    const body = document.querySelector('body');
    if (layer) {
      body?.classList.add('overflow-hidden');
    } else {
      body?.classList.remove('overflow-hidden');
    }
  }, [layer]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-center">
        <div className="basis-full sm:basis-3/4 px-1">
          <Feed />
        </div>

        <div className=" sm:block grow">
          <Side />
        </div>
      </div>

      {layer && <Layer containerClassName={layer.containerClassName ?? ''}>{layer.node}</Layer>}

      <div className={`modal-${modal ? 'show' : 'hidden'}`}>
        <div className="flex justify-center w-full">
          <Modal />
        </div>
      </div>
    </>
  );
}
