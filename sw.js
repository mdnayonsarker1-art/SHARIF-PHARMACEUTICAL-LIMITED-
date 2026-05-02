const CACHE_NAME = 'sharif-pharma-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './details.html',
    './history.html',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // যদি কোনো ফাইল না পাওয়া যায় তবুও যেন বাকিগুলো ক্যাশ হয়
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(url => cache.add(url))
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
