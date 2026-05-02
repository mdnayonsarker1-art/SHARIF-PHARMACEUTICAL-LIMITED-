const CACHE_NAME = 'sharif-pharma-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './details.html',
    './history.html',
    './logo.png',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// সার্ভিস ওয়ার্কার ইন্সটল
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // addAll এর বদলে ম্যাপ ব্যবহার করা নিরাপদ
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(url => cache.add(url))
            ).then(() => console.log("Assets Cached Successfully"));
        })
    );
});

// অফলাইনে ফাইল সার্ভ করা
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
