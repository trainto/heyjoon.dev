'use client';

import Layer from '@/components/common/layer';
import { useSante } from '@/lib/store';
import { Noto_Sans_KR } from 'next/font/google';

const noto = Noto_Sans_KR({
  weight: ['400', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

export default function PlaceLayout({ children }: { children: React.ReactNode }) {
  const { layer } = useSante(['layer']);

  return (
    <div className={noto.className}>
      {children}

      {layer && <Layer containerClassName={layer.containerClassName ?? ''}>{layer.node}</Layer>}
    </div>
  );
}
