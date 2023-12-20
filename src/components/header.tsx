'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import Signin from './places/signin';
import useStore from '@/lib/store';
import Avatar from './places/avatar';

const Header = () => {
  const [mobileNavHidden, setMobileNavHidden] = useState(false);

  const { value: userInfo } = useStore('userInfo');

  const pathname = usePathname();

  const sticky = useMemo(() => pathname === '/' || pathname.startsWith('/places'), [pathname]);

  const throttleRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handler = () => {
      if (throttleRef.current) {
        return;
      }

      throttleRef.current = setTimeout(() => {
        if (document.documentElement.scrollTop > 200) {
          setMobileNavHidden(true);
        } else if (document.documentElement.scrollTop < 150) {
          setMobileNavHidden(false);
        }
        throttleRef.current = undefined;
      }, 100);
    };

    document.addEventListener('scroll', handler);

    return () => document.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`pt-3 pb-1 px-5 z-40 ${sticky ? 'sticky top-0' : ''}`}>
      <div className="flex justify-between sm:justify-end items-end space-x-5 z-40">
        <div className="sm:hidden">
          {userInfo ? <Avatar src={userInfo.avatar} size={32} /> : <Signin width={130} />}
        </div>
        <div className="hidden sm:block">
          <Nav />
        </div>

        <Link
          href="/"
          className={`text-2xl sm:text-4xl font-bold ${
            pathname === '/' ? 'text-gray-300-animation' : 'text-brand1-animation'
          }`}
        >
          Joon.log()
        </Link>
      </div>

      <div
        className={`flex justify-end sm:hidden z-10 ${
          mobileNavHidden ? 'mobile-nav-hidden' : 'mobile-nav-show'
        }`}
      >
        <Nav />
      </div>
    </header>
  );
};

const Nav = () => {
  const pathname = usePathname();

  return (
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
  );
};

export default Header;
