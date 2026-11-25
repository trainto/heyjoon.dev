'use client';

import { useAuthState, useStandalone } from '@/lib/hooks';
import { dispatch, useSante } from '@/lib/store';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef } from 'react';
import Avatar from '../places/avatar';
import Signin from '../places/signin';
import UserDetail from '../places/user-detail';

const Header = () => {
  const { userInfo } = useSante(['userInfo']);

  const router = useRouter();
  const pathname = usePathname();
  const authIconKind = useAuthState();

  const sticky = useMemo(() => pathname === '/' || pathname.startsWith('/places'), [pathname]);

  const isStandalone = useStandalone();

  const onAvatarClick = useCallback(() => {
    dispatch('layer', { node: <UserDetail />, containerClassName: 'w-full sm:w-96' });
  }, []);

  const sideTimer = useRef<NodeJS.Timeout>(undefined);
  const sideEventCount = useRef(0);
  const sideRef = useRef<'left' | 'right' | null>(null);
  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    if (userInfo?.email !== 'trainto@gmail.com') {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const side: 'left' | 'right' = e.clientX - rect.left < rect.width / 2 ? 'left' : 'right';

    if (sideTimer.current) {
      clearTimeout(sideTimer.current);
    }

    if (sideRef.current !== side) {
      sideRef.current = side;
      sideEventCount.current = 0;
    }

    if (sideEventCount.current >= 4) {
      sideEventCount.current = 0;
      sideRef.current = null;
      router.push(side === 'left' ? '/bp' : '/music');
      return;
    }

    sideEventCount.current = sideEventCount.current + 1;
    sideTimer.current = setTimeout(() => {
      sideEventCount.current = 0;
      sideRef.current = null;
      sideTimer.current = undefined;
    }, 500);
  };

  return (
    <header
      className={`pt-3 pb-2 px-3 z-40 ${sticky ? 'sticky top-0' : ''}`}
      onMouseDown={handleMouseDown}
    >
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
          <div className={isStandalone ? 'hidden' : 'sm:block'}>
            <Nav />
          </div>
          <Link
            href={isStandalone ? '/places' : '/'}
            className={`text-2xl sm:text-4xl font-bold ${
              pathname === '/' ? 'text-gray-300-animation' : 'text-brand1-animation'
            } ${isStandalone ? 'italic' : ''}`}
          >
            {isStandalone ? 'Places' : 'Joon.log()'}
          </Link>
        </div>
      </div>

      <style jsx>{`
        header {
          -webkit-user-select: none;
        }
      `}</style>
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

      <span className="text-xs text-gray-500 px-2">|</span>
      <span>
        <Link
          href="/places"
          className={`${
            pathname.startsWith('/places') ? 'text-brand2-animation' : 'text-gray-300-animation'
          }`}
        >
          Places
        </Link>
      </span>
    </nav>
  );
};

export default Header;
