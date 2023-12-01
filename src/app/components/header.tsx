'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="text-right">
      <Link href="/">
        <h1
          className={`text-5xl pt-10 font-bold ${
            pathname === '/' ? 'text-gray-300' : 'text-brand1'
          }`}
        >
          Joon.log()
        </h1>
      </Link>
    </header>
  );
};

export default Header;
