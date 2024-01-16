'use client';

import Loading from '@/components/places/loading';
import { signin } from '@/lib/api';
import { useCallback, useEffect, useRef } from 'react';

export default function GoogleAuth() {
  const doneRef = useRef(false);

  const signIn = useCallback(async (token: string) => {
    await signin(token);
  }, []);

  useEffect(() => {
    const tokenParam = window.location.hash.split('&').find((v) => {
      return v.includes('access_token=');
    });

    if (!tokenParam) {
      return;
    }

    const token = tokenParam.split('=')[1];

    if (doneRef.current === false) {
      doneRef.current = true;

      if (window.opener) {
        window.opener.postMessage({ googleToken: token, from: window.name.split('=')[1] });
        window.close();
      } else {
        // Redirected to PWA case
        signIn(token);
      }
    }
  }, [signIn]);

  return (
    <div className="fixed h-screen w-screen bg-black top-0 left-0 z-50 grid place-content-center">
      <Loading />
    </div>
  );
}
