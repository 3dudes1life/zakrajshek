const VERSION = 'zak-v93-roots-20260927';
const STATIC = `${VERSION}-static`;
const PAGES = `${VERSION}-pages`;
const CORE = [
  '/', '/index.html', '/william.html', '/about.html', '/speaking.html', '/media.html',
  '/books-podcast.html', '/dj-will-z.html', '/out-at-the-fair.html', '/credits.html', '/research.html',
  '/404.html', '/assets/site.css', '/assets/site.js',
  '/assets/media/roots/bloke-landscape.jpg', '/assets/media/roots/iron-range-mine.jpg',
  '/assets/media/roots/slovene-wedding-eveleth-1908.jpg',
  '/assets/media/roots/st-regis-expansion-1980.jpg',
  '/assets/media/william-caleb-daniel-life.webp', '/favicon.svg', '/site.webmanifest'
];
self.addEventListener('install', event => event.waitUntil(caches.open(STATIC).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => !key.startsWith(VERSION)).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(PAGES).then(cache => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request).then(hit => hit || caches.match('/404.html'))));
    return;
  }
  if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(caches.match(request).then(hit => hit || fetch(request).then(response => {
      if (response.ok) { const copy = response.clone(); caches.open(STATIC).then(cache => cache.put(request, copy)); }
      return response;
    })));
  }
});
