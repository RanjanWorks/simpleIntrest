// Service worker version
var version = 'v1';

// Cache name
var cacheName = 'my-app-cache-' + version;

// Files to cache
var filesToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/images/icons.png',
  '/manifest.json',

];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll(filesToCache);
      })
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(name) {
            return name !== cacheName;
          }).map(function(name) {
            return caches.delete(name);
          })
        );
      })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});

