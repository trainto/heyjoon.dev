'use client';

import { Suspense, useEffect } from 'react';
import Feed from './feed';
import Side from './side';

export default function Main() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/places' });
    }
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-center">
      <div className="basis-full sm:basis-3/4 px-1">
        <Suspense>
          <Feed />
        </Suspense>
      </div>

      <div className="sm:block basis-1/4">
        <Side />
      </div>
    </div>
  );
}
