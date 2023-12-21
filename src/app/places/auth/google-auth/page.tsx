'use client';

import { useEffect, useRef } from 'react';
import Loading from '@/components/places/loading';

export default function GoogleAuth() {
  const doneRef = useRef(false);

  useEffect(() => {
    const tokenParam = window.location.hash.split('&').find((v) => {
      return v.includes('access_token=');
    });

    if (!tokenParam) {
      return;
    }

    const token = tokenParam.split('=')[1];

    if (doneRef.current === false) {
      window.opener.postMessage({ googleToken: token, from: window.name.split('=')[1] });
      doneRef.current = true;
    }
    window.close();
  }, []);

  return (
    <div className="fixed h-screen w-screen bg-black top-0 left-0 z-50 grid place-content-center">
      <Loading />
    </div>
  );
}
