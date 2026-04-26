const CACHE_VERSION = 'academy-mra-v81';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const OFFLINE_URL = '/404.html';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/404.html',
  '/assets/css/style.css',
  '/assets/css/enhancements.css',
  '/assets/css/pro-optimizations.css',
  '/assets/css/inline-extracted.css',
  '/assets/js/script.js',
  '/assets/js/site-experience.js',
  '/assets/js/search-data.js',
  '/assets/js/auth.js',
  '/assets/js/media-optimizer.js',
  '/assets/js/page-interactions.js',
  '/assets/images/hero-poster.webp',
  '/assets/images/logo-academy-mra.webp',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png',
  '/assets/video/hero-background.webm',
  '/assets/video/hero-background.mp4'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL)))
    );
    return;
  }

  if (/\.(?:css|js|webp|png|jpg|jpeg|svg|mp4|webm|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
        return response;
      }))
    );
  }
});
