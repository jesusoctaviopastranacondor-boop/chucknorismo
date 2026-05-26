const CACHE_NAME = "chucknorismo-v1";

const FILES_TO_CACHE = [
  "index.html",
  "gaming.html",
  "tech.html",
  "empresa.html",
  "manifest.json",
  "halofondor.jpg",
  "warhammerfondo.jpg",
  "starwarsfondor.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});