const CACHE_NAME = 'spotify-cache-v1';
const FILES_TO_CACHE = [
  '/', 
  '/index.html',
  '/assets/spotify-logo.png',
  '/assets/Spotify_logo.svg'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');

  self.skipWaiting(); 

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');

  event.waitUntil(clients.claim());

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker fetching:', event.request.url);

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then(cache => {
          const url = event.request.url;
          cache.put(event.request, responseToCache);
          
          if (url.includes('/songs/') || url.endsWith('.mp3')) {
            console.log('Cached song file:', url);
          }
        });

        return response;
      });
    })
  );
}); 