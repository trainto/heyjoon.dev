'use client';

import Feed from '@/components/places/feed';
import Side from '@/components/places/side';
import Layer from '@/components/layer';
import useStore from '@/lib/store';
import { useEffect } from 'react';

export default function Places() {
  const { value: layer } = useStore('layer');

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
    </>
  );
}
