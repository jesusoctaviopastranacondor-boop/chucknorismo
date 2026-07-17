const CACHE_NAME = "el-octoverso-v1";

const CORE_ASSETS = [
    "./",
    "./indice.html",
    "./Gaming.html",
    "./tech.html",
    "./empresa.html",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png",
    "./apple-touch-icon.png",
    "./halofondo.jpeg",
    "./warhammerfondo.jpg",
    "./starwarsfondo.jpg",
    "./mentalista.jpg",
    "./ViT5R8V-dexter-hd-wallpaper.jpg",
    "./oracle.jpg",
    "./nvidia.png",
    "./microsoft.jpg",
    "./chuck.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            await Promise.allSettled(
                CORE_ASSETS.map(asset => cache.add(asset))
            );
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    const request = event.request;

    if(request.method !== "GET"){
        return;
    }

    const requestUrl = new URL(request.url);

    if(requestUrl.origin !== self.location.origin){
        return;
    }

    if(request.mode === "navigate"){
        event.respondWith(
            fetch(request)
                .then(response => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, copy);
                    });
                    return response;
                })
                .catch(async () => {
                    return (
                        await caches.match(request)
                    ) || (
                        await caches.match("./indice.html")
                    );
                })
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(cachedResponse => {
            const networkResponse = fetch(request)
                .then(response => {
                    if(response && response.ok){
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, copy);
                        });
                    }
                    return response;
                })
                .catch(() => cachedResponse);

            return cachedResponse || networkResponse;
        })
    );
});
