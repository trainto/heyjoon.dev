const CACHE_PREFIX = 'places-cache-';
const CACHE_NAME = CACHE_PREFIX + '__BUILD_ID__';
const LEGACY_CACHE_NAME = 'heyjoon.dev/places-cache';

const putInCache = async (request, response) => {
  if (!response.ok) {
    return;
  }

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const cacheFirst = async ({ request }) => {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  let responseFromNetwork;
  try {
    responseFromNetwork = await fetch(request);
  } catch {
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  try {
    await putInCache(request, responseFromNetwork.clone());
  } catch {
    // Caching is best-effort; ignore storage failures (e.g. quota exceeded).
  }

  return responseFromNetwork;
};

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter(
            (name) =>
              name === LEGACY_CACHE_NAME || (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME),
          )
          .map((name) => caches.delete(name)),
      ),
    ),
  );
});

if (location.hostname === 'heyjoon.dev') {
  self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method === 'GET' && new URL(request.url).pathname.startsWith('/_next/static/')) {
      event.respondWith(cacheFirst({ request }));
    }
  });
}
