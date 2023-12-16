'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="flex justify-end items-end space-x-5 px-5">
      <nav>
        <span>
          <Link
            href="/about"
            className={`${
              pathname.startsWith('/about') ? 'text-brand2-animation' : 'text-gray-300-animation'
            }`}
          >
            About
          </Link>
        </span>
        <span className="text-xs text-gray-500 px-2">|</span>
        <span>
          <Link
            href="/"
            className={`${
              pathname.startsWith('/posts') || pathname === '/'
                ? 'text-brand2-animation'
                : 'text-gray-300-animation'
            }`}
          >
            Blog
          </Link>
        </span>
        {/* <span className="text-xs text-gray-500 px-2">|</span>
        <span>
          <Link
            href="/places"
            className={`${
              pathname.startsWith('/places') ? 'text-brand2-animation' : 'text-gray-300-animation'
            }`}
          >
            Places
          </Link>
        </span> */}
      </nav>
      <Link
        href="/"
        className={`text-4xl pt-10 font-bold ${
          pathname === '/' ? 'text-gray-300-animation' : 'text-brand1-animation'
        }`}
      >
        Joon.log()
      </Link>
    </header>
  );
};

export default Header;
