import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import Script from 'next/script';
import Footer from '../components/common/footer';
import Header from '../components/common/header';

import './globals.css';

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hakoon Sim (심학준) - Joon.log()',
  description: 'A personal blog by Hakjoon Sim (심학준)',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-RKYVNDDD7T"></Script>
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-RKYVNDDD7T');

        `}
      </Script>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6978978720477594"
        crossOrigin="anonymous"
      />

      <body className={`${roboto.className} container mx-auto`}>
        <Header />

        <main className="mt-10">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
