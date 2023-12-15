import Feed from '@/components/places/feed';

import './places.css';
import Side from '@/components/places/side';
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';

const noto = Noto_Sans_KR({
  weight: ['400', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Places() {
  return (
    <div className={noto.className}>
      <div className="flex flex-col sm:flex-row justify-center">
        <div className="basis-full sm:basis-3/4 px-5">
          <Feed />
        </div>

        <div className="hidden sm:block grow">
          <Side />
        </div>
      </div>
    </div>
  );
}
