import { useCallback, useEffect, useRef } from 'react';

export const useScrollHitBottom = (callback: () => void) => {
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
