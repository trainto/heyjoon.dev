import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Header from './components/header';
import './globals.css';
import Link from 'next/link';

const roboto = Roboto({ weight: ['400', '700'], style: ['normal'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Joon.log()',
  description: 'A personal blog by Hakjoon Sim',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
