'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="text-right px-5">
      <Link href="/">
        <div
          className={`text-4xl pt-10 font-bold ${
            pathname === '/' ? 'text-gray-300-animation' : 'text-brand1-animation'
          }`}
        >
          Joon.log()
        </div>
      </Link>
    </header>
  );
};

export default Header;
