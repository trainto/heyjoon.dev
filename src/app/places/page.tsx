'use client';

import Feed from '@/components/places/feed';
import Side from '@/components/places/side';
import Layer from '@/components/layer';
import useStore from '@/lib/store';

export default function Places() {
  const { value: layer } = useStore('layer');

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
