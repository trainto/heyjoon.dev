'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const Header = () => {
  const pathname = usePathname();

  const sticky = useMemo(() => pathname === '/' || pathname.startsWith('/places'), [pathname]);

  return (
    <header
      className={`flex justify-end items-end space-x-5 px-5 pt-3 pb-1 z-50 ${
        sticky ? 'sticky top-0' : ''
      }`}
    >
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
        className={`text-2xl sm:text-4xl font-bold ${
          pathname === '/' ? 'text-gray-300-animation' : 'text-brand1-animation'
        }`}
      >
        Joon.log()
      </Link>
    </header>
  );
};

export default Header;
