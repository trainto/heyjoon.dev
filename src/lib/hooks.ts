import axios from 'axios';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from './api/fetchers';
import { dispatch, useSante } from './store';
import { storage } from './utils-client';

export const useScrollHitTheBottom = (callback: () => void) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttleRef = useRef<NodeJS.Timeout | null>(null);
  const callbackThrottleRef = useRef<NodeJS.Timeout | null>(null);

  const handler = useCallback(() => {
    if (throttleRef.current) {
      return;
    }

    throttleRef.current = setTimeout(() => {
      const elem = document.documentElement;
      if (elem.clientHeight + elem.scrollTop + 100 >= elem.scrollHeight) {
        if (callbackThrottleRef.current) {
          return;
        }

        callbackThrottleRef.current = setTimeout(() => {
          callbackThrottleRef.current = null;
          throttleRef.current = null;
          callbackRef.current();
        }, 500);
      }

      throttleRef.current = null;
    }, 100);
  }, []);

  useEffect(() => {
    document.addEventListener('scroll', handler);

    return () => document.removeEventListener('scroll', handler);
  }, [handler]);
};

// export const useScrollDirection = (callback: (direction: 'UP' | 'DOWN') => void) => {
//   const callbackRef = useRef(callback);
//   const previousScrollTop = useRef<number>();

//   useEffect(() => {
//     callbackRef.current = callback;
//   }, [callback]);

//   const throttleRef = useRef<NodeJS.Timeout | null>(null);
//   const callbackThrottleRef = useRef<NodeJS.Timeout | null>(null);

//   const handler = useCallback(() => {
//     if (throttleRef.current) {
//       return;
//     }

//     throttleRef.current = setTimeout(() => {
//       const elem = document.documentElement;
//       if (previousScrollTop.current != null) {
//         if (previousScrollTop.current < elem.scrollTop) {
//           callbackThrottleRef.current = setTimeout(() => {
//             callbackThrottleRef.current = null;
//             throttleRef.current = null;
//             callbackRef.current('DOWN');
//           }, 500);
//         } else if (previousScrollTop.current > elem.scrollTop) {
//           callbackThrottleRef.current = setTimeout(() => {
//             callbackThrottleRef.current = null;
//             throttleRef.current = null;
//             callbackRef.current('UP');
//           }, 500);
//         }
//       }

//       previousScrollTop.current = elem.scrollTop;

//       throttleRef.current = null;
//     }, 100);
//   }, []);

//   useEffect(() => {
//     document.addEventListener('scroll', handler);

//     return () => document.removeEventListener('scroll', handler);
//   }, [handler]);
// };

export const useResize = (callback: () => void, instant?: boolean) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleResize = useCallback(() => {
    callbackRef.current();
  }, []);

  useEffect(() => {
    if (instant) {
      handleResize();
    }
  }, [handleResize, instant]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
};

export const useClickOutside = (callback: (e: MouseEvent) => void) => {
  const callbackRef = useRef(callback);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && e.target && !containerRef.current.contains(e.target as Node)) {
        callbackRef.current(e);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return containerRef;
};

export const useAuthState = () => {
  const [authIconKind, setAuthIconKind] = useState<null | 'google' | 'avatar'>(null);

  const pathname = usePathname();

  const { userInfo } = useSante(['userInfo']);

  const { data: userInfoFetched, error } = useSWR<UserInfo>(
    pathname.startsWith('/places') ? '/places/users/me' : null,
    userInfo || !storage.get('isLogin') ? null : fetcher,
    { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  useEffect(() => {
    if (userInfoFetched && userInfo == null) {
      dispatch('userInfo', userInfoFetched);
    }
  }, [userInfo, userInfoFetched]);

  useEffect(() => {
    if (error && axios.isAxiosError(error) && error.response && error.response.status === 401) {
      storage.remove('isLogin');
      dispatch('userInfo', null);
    }
  }, [error]);

  useEffect(() => {
    if (!pathname.startsWith('/places')) {
      setAuthIconKind(null);
      return;
    }

    if (!storage.get('isLogin')) {
      setAuthIconKind('google');
      return;
    } else {
      if (!userInfo) {
        setAuthIconKind(null);
        return;
      } else {
        setAuthIconKind('avatar');
      }
    }
  }, [pathname, userInfo]);

  return authIconKind;
};

export const useStandalone = () => {
  const [isStandalone, setIsStandAlone] = useState(false);

  useEffect(() => {
    const mqStandAlone = '(display-mode: standalone)';
    if (window.matchMedia(mqStandAlone).matches) {
      setIsStandAlone(true);
    } else {
      setIsStandAlone(false);
    }
  }, []);

  return isStandalone;
};
