'use client';

import Layer from '@/components/common/layer';
import { useSante } from '@/lib/store';

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  const { layer } = useSante(['layer']);

  return (
    <>
      {children}

      {layer && <Layer containerClassName={layer.containerClassName ?? ''}>{layer.node}</Layer>}
    </>
  );
}
