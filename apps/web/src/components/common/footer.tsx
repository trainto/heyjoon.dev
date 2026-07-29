'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState<number>();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="flex justify-between items-end border-t border-gray-500 text-sm text-gray-400 text-right mt-10 pt-2 pb-10 px-2 mx-5 sm:mx-0">
      <div>
        <Link href="/" className="text-brand1">
          Joon.log()
        </Link>
      </div>
      <div className="text-xs">
        Hakjoon Sim <span className="text-brand1">©{year}</span>
      </div>
    </footer>
  );
}
