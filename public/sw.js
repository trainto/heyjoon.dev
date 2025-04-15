const CACHE_NAME = 'heyjoon.dev/places-cache';

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const cacheFirst = async ({ request }) => {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch {
    if (cached) {
      return cached;
    }

    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/_next/static/')) {
    event.respondWith(
      cacheFirst({
        request: event.request,
      }),
    );
  }
});

self.addEventListener('install', () => {
  self.skipWaiting();
});
