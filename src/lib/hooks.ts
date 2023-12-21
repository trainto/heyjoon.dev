import { useCallback, useEffect, useRef } from 'react';

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

  const handleRisize = useCallback(() => {
    callbackRef.current();
  }, []);

  useEffect(() => {
    instant && handleRisize();
  }, [handleRisize, instant]);

  useEffect(() => {
    window.addEventListener('resize', handleRisize);

    return () => window.removeEventListener('resize', handleRisize);
  }, [handleRisize]);
};
