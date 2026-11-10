'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Feed from './feed';
import PlaceDetail from './place-detail';
import Side from './side';

const getPlaceIdFromHash = () => {
  const match = /^#(\d+)$/.exec(window.location.hash);
  return match ? match[1] : null;
};

export default function Main() {
  const [placeId, setPlaceId] = useState<string | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/places' });
    }
  }, []);

  // Next.js client-side navigation (pushState) doesn't fire 'hashchange', so
  // re-check the hash whenever Next's router updates pathname/search params too.
  useEffect(() => {
    setPlaceId(getPlaceIdFromHash());
  }, [pathname, searchParams]);

  useEffect(() => {
    const onHashChange = () => setPlaceId(getPlaceIdFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-center">
      <div className="basis-full sm:basis-3/4 px-1">
        {placeId ? (
          <PlaceDetail id={placeId} />
        ) : (
          <Suspense>
            <Feed />
          </Suspense>
        )}
      </div>

      <div className="sm:block basis-1/4">
        <Side />
      </div>
    </div>
  );
}
