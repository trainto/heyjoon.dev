const CACHE_NAME = 'heyjoon.dev/places-cache';

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return fetch(event.request)
        .then((res) => {
          if (!res || res.status !== 200 || res.type !== 'basic') return res;

          const responseToCache = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));

          return res;
        })
        .catch(() => cached);
    }),
  );
});
