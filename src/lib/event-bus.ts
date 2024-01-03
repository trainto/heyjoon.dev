import { useEffect, useRef } from 'react';

type EventType = 'fetchPlaces' | 'cropClicked';

export const useEventBus = (ev: EventType, callback: () => void) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = () => {
      callbackRef.current();
    };

    window.addEventListener(ev, handler);

    return () => window.removeEventListener(ev, handler);
  }, [ev]);
};

export const dispatchEvent = (ev: EventType) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(ev));
};
