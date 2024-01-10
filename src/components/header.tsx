'use client';

import { useAuthState } from '@/lib/hooks';
import useStore, { dispatch } from '@/lib/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import Avatar from './places/avatar';
import Signin from './places/signin';
import UserDetail from './places/user-detail';

const Header = () => {
  const { value: userInfo } = useStore('userInfo');

  const pathname = usePathname();

  const authIconKind = useAuthState();

  const sticky = useMemo(() => pathname === '/' || pathname.startsWith('/places'), [pathname]);

  const onAvatarClick = useCallback(() => {
    dispatch('layer', { node: <UserDetail />, containerClassName: 'w-full sm:w-96' });
  }, []);

  return (
    <header className={`pt-3 pb-2 px-3 z-40 ${sticky ? 'sticky top-0' : ''}`}>
      <div
        className={`flex ${
          pathname.startsWith('/places') ? 'justify-between' : 'justify-end'
        } sm:justify-end items-end space-x-5 z-40`}
      >
        <div className="sm:hidden">
          {authIconKind === 'google' ? (
            <Signin width={130} from="header" />
          ) : authIconKind === 'avatar' && userInfo ? (
            <Avatar src={userInfo?.avatar ?? ''} size={32} onClick={onAvatarClick} />
          ) : null}
        </div>

        <div className={`flex items-end space-x-3 sm:space-x-5`}>
          <div className={`${authIconKind === 'google' && 'hidden'} sm:block`}>
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
