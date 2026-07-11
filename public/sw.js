/*
 * Toolbelt service worker — deliberately minimal and safe.
 *
 * The app is money- and state-sensitive (estimates, invoices, payments), so
 * this SW NEVER caches HTML documents or API responses — that would re-create
 * the stale-content bug we already fixed. It only:
 *   1. cache-first serves immutable, content-hashed static assets (/_next/static, icons)
 *   2. shows an offline fallback for page navigations when the network is down
 * Everything else passes straight through to the network.
 */
const VERSION = 'v1';
const STATIC_CACHE = `toolbelt-static-${VERSION}`;
const OFFLINE_URL = '/offline';
const PRECACHE = [OFFLINE_URL, '/icon-512.png', '/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

function isHashedStatic(url) {
  return (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/_next/static/') ||
      /\.(?:png|svg|jpg|jpeg|webp|ico|woff2?)$/.test(url.pathname))
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never touch API routes or cross-origin — always live network.
  if (url.pathname.startsWith('/api/') || url.origin !== self.location.origin) return;

  // Immutable hashed assets: cache-first (safe — the URL changes on rebuild).
  if (isHashedStatic(url)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
            return res;
          }),
      ),
    );
    return;
  }

  // Page navigations: network-first, offline fallback. Never cache the HTML.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
  }
});
