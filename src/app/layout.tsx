import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import Header from '../components/header';
import Link from 'next/link';
import Script from 'next/script';

import './globals.css';

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hakoon Sim - Joon.log()',
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

      <body className={`${roboto.className} container mx-auto`}>
        <Header />

        <main className="mt-10">{children}</main>

        <footer className="flex justify-between items-end border-t border-gray-500 text-sm text-gray-400 text-right mt-10 pt-2 pb-10 px-2 mx-5 sm:mx-0">
          <div>
            <Link href="/" className="text-brand1">
              Joon.log()
            </Link>
          </div>
          <div className="text-xs">
            Hakjoon Sim <span className="text-brand1">©{new Date().getFullYear()}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
