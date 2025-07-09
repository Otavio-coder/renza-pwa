
const CACHE_NAME = 'renza-planejados-cache-v1';
// IMPORTANT: Update these URLs if your constants.ts BACKGROUND_IMAGE_URL changes.
// For simplicity, we are hardcoding it here. A more advanced setup might fetch it dynamically
// or pass it during the build process.
const BACKGROUND_URL = 'https://i.ibb.co/RkVrc3vw/Background-Renza-1.png';

const urlsToCache = [
  '/',
  '/index.html',
  // Add other critical assets like main CSS if not inlined or CDN
  // '/styles/main.css', // Example
  // '/index.tsx', // Or the bundled output like '/main.js' - esm.sh makes this tricky for direct SW cache
  BACKGROUND_URL
  // Add paths to your icons if you want to cache them explicitly
  // '/icons/icon-192x192.png',
  // '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell and critical assets');
        // Create an array of Request objects for external URLs to ensure CORS compatibility
        const requestsToCache = urlsToCache.map(url => {
          if (url.startsWith('http')) {
            return new Request(url, { mode: 'cors' });
          }
          return url;
        });
        return cache.addAll(requestsToCache);
      })
      .catch(error => {
        console.error('[Service Worker] Failed to cache on install:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // We only want to intercept GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // For navigation requests (HTML pages), try network first, then cache, then offline page.
  // For other assets, try cache first, then network.
  // This is a basic strategy; more complex ones exist.

  const requestUrl = new URL(event.request.url);

  // If the request is for an esm.sh URL, try network first, then cache.
  // These are JavaScript modules and should ideally be fresh.
  if (requestUrl.hostname === 'esm.sh') {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          // Optional: Cache successful esm.sh responses for better offline resilience
          // if (networkResponse && networkResponse.status === 200) {
          //   const cache = await caches.open(CACHE_NAME);
          //   cache.put(event.request, networkResponse.clone());
          // }
          return networkResponse;
        })
        .catch(() => {
          // If network fails, try to serve from cache if available
          return caches.match(event.request);
        })
    );
    return;
  }


  // For other requests (app shell, images), use cache-first strategy.
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // console.log('[Service Worker] Returning from cache:', event.request.url);
          return cachedResponse;
        }
        // console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request).then((networkResponse) => {
          // Optional: Cache new resources on the fly
          // Be careful with caching everything, especially non-GET or large files
          if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
            // Check if it's one of our defined URLs to cache or a new asset we might want.
            // For simplicity, this example doesn't dynamically cache all new resources.
            // If it's one of the explicitly cached URLs that somehow missed the initial cache,
            // or a new version, we might want to update the cache.
            // For now, we rely on the install-time caching for the defined assets.
          }
          return networkResponse;
        }).catch(error => {
          console.error('[Service Worker] Fetch failed; returning offline fallback or error for:', event.request.url, error);
          // Optionally, return a generic offline fallback page or image here
          // For example, if (event.request.destination === 'document') return caches.match('/offline.html');
        });
      })
  );
});