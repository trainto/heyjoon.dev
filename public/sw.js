const CACHE_NAME = 'heyjoon.dev/places-cache';

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const cacheFirst = async ({ request }) => {
  console.log(request.url);
  const cached = await caches.match(request);
  if (cached) {
    if (cached.headers.get('Content-Type') !== 'application/json' && cached.status === 200) {
      return cached;
    }
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
  if (event.request.url.startsWith('chrome-extension://') || event.request.method === 'POST') {
    return;
  }

  event.respondWith(
    cacheFirst({
      request: event.request,
    }),
  );
});

self.addEventListener('install', () => {
  self.skipWaiting();
});