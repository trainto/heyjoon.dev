'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import Signin from './places/signin';
import useStore from '@/lib/store';
import Avatar from './places/avatar';

const Header = () => {
  const { value: userInfo } = useStore('userInfo');

  const pathname = usePathname();

  const showSigninIcon = useMemo(
    () => pathname.startsWith('/places') && !userInfo,
    [pathname, userInfo],
  );

  const sticky = useMemo(() => pathname === '/' || pathname.startsWith('/places'), [pathname]);

  return (
    <header className={`pt-3 pb-2 px-3 z-40 ${sticky ? 'sticky top-0' : ''}`}>
      <div
        className={`flex ${
          pathname.startsWith('/places') ? 'justify-between' : 'justify-end'
        } sm:justify-end items-end space-x-5 z-40`}
      >
        <div className="sm:hidden">
          {pathname.startsWith('/places') &&
            (userInfo ? (
              <Avatar src={userInfo.avatar} size={32} />
            ) : (
              <Signin width={130} from="header" />
            ))}
        </div>

        <div className={`flex items-end space-x-3 sm:space-x-5`}>
          <div className={`${showSigninIcon && 'hidden'} sm:block`}>
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
      </div>
    </header>
  );
};

const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className="text-sm sm:text-base">
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

      <span className="text-xs text-gray-500 px-2">|</span>

      <span>
        <Link
          href="/about"
          className={`${
            pathname.startsWith('/about') ? 'text-brand2-animation' : 'text-gray-300-animation'
          }`}
        >
          CV
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
