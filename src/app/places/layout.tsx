import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import React from 'react';

import Layout from '@/components/places/layout';
import './places.css';

export const metadata: Metadata = {
  title: 'Places - Joon.log()',
  description: 'Hot places shared by ordinary people',
};

const noto = Noto_Sans_KR({
  weight: ['400', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

export default function PlaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={noto.className}>
      <Layout>{children}</Layout>
    </div>
  );
}
