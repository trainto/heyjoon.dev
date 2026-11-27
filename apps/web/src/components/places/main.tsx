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
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) {
      return;
    }

    let disposed = false;

    // clients.claim() in sw.js fires 'controllerchange' on first install too (no prior
    // controller), and in every tab when any tab accepts an update. Only reload this
    // tab if its own user accepted the update prompt.
    let updateAccepted = false;
    let reloaded = false;
    const onControllerChange = () => {
      if (!updateAccepted || reloaded) {
        return;
      }
      reloaded = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    const promptForUpdate = (worker: ServiceWorker) => {
      if (disposed) {
        return;
      }
      if (window.confirm('A new version is available. Reload now?')) {
        updateAccepted = true;
        worker.postMessage('SKIP_WAITING');
      }
    };

    // An installing worker only represents an update if this registration already
    // controlled an active worker; otherwise it's just the first install.
    const watchInstalling = (
      installing: ServiceWorker,
      registration: ServiceWorkerRegistration,
    ) => {
      const hadActiveWorker = Boolean(registration.active);
      const onStateChange = () => {
        if (disposed) {
          return;
        }
        if (hadActiveWorker && installing.state === 'installed' && registration.waiting) {
          promptForUpdate(registration.waiting);
        }
      };
      installing.addEventListener('statechange', onStateChange);
      return () => installing.removeEventListener('statechange', onStateChange);
    };

    let registrationRef: ServiceWorkerRegistration | undefined;
    let onUpdateFound: (() => void) | undefined;
    let unwatchInstalling: (() => void) | undefined;

    navigator.serviceWorker
      .register('/sw.js', { scope: '/places' })
      .then((registration) => {
        if (disposed) {
          return;
        }

        registrationRef = registration;

        if (registration.active && registration.waiting) {
          promptForUpdate(registration.waiting);
        }

        if (registration.installing) {
          unwatchInstalling = watchInstalling(registration.installing, registration);
        }

        onUpdateFound = () => {
          unwatchInstalling?.();
          if (registration.installing) {
            unwatchInstalling = watchInstalling(registration.installing, registration);
          }
        };
        registration.addEventListener('updatefound', onUpdateFound);
      })
      .catch((error) => {
        console.error('Service worker registration failed', error);
      });

    return () => {
      disposed = true;
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      unwatchInstalling?.();
      if (registrationRef && onUpdateFound) {
        registrationRef.removeEventListener('updatefound', onUpdateFound);
      }
    };
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
