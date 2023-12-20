'use client';

import Feed from '@/components/places/feed';
import Side from '@/components/places/side';
import { Noto_Sans_KR } from 'next/font/google';
import Layer from '@/components/layer';
import useStore from '@/lib/store';

import './places.css';
import LoginHandler from '@/components/places/login-handler';

const noto = Noto_Sans_KR({
  weight: ['400', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Places() {
  const { value: layer } = useStore('layer');

  return (
    <div className={noto.className}>
      <div className="flex flex-col sm:flex-row justify-center">
        <div className="basis-full sm:basis-3/4 px-5">
          <Feed />
        </div>

        <div className=" sm:block grow">
          <Side />
        </div>
      </div>

      {layer && <Layer>{layer}</Layer>}
      <LoginHandler />
    </div>
  );
}
