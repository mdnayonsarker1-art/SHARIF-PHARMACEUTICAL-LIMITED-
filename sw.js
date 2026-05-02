const CACHE_NAME = 'sharif-pharma-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/details.html',
    '/history.html', // আপনার হিস্টোরি পেজের নাম
    '/logo.png',
    '/manifest.json',
    // এক্সটার্নাল লাইব্রেরিগুলো ক্যাশ করা হচ্ছে যাতে অফলাইনে ডিজাইন না ভাঙে
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
];

// সার্ভিস ওয়ার্কার ইন্সটল হওয়া এবং ফাইল ক্যাশ করা
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// অফলাইনে ফাইলগুলো সার্ভ করা
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});