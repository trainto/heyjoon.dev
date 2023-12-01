import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Header from './components/header';
import './globals.css';

const roboto = Roboto({ weight: ['400', '700'], style: ['normal'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Joon.log()',
  description: 'A personal blog by Hakjoon Sim',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} container px-10 mx-auto`}>
        <Header />

        <main className="mt-10">{children}</main>

        <footer className="border-t border-gray-500 text-sm text-gray-400 text-right mt-10 pt-2 pb-10 px-5">
          Hakjoon Sim <span className="text-brand1">©{new Date().getFullYear()}</span>
        </footer>
      </body>
    </html>
  );
}
