import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({ weight: '400', style: ['normal'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Joon.log()',
  description: 'A personal blog by Hakjoon Sim',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} container mx-auto`}>
        <header className="text-center">
          <h1 className="text-5xl pt-10">Joon.log()</h1>
        </header>

        <main className="pt-5">{children}</main>

        <footer className="border-t border-gray-500 text-sm text-gray-400 text-right mt-10 pt-2 pb-10 px-5">
          Hakjoon Sim ©{new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
