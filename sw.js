const CACHE_NAME = 'sharif-pharma-v2'; // ভার্সন আপডেট করা হলো
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './details.html',
    './history.html',
    './entry-form.html',
    './paid-entry.html',
    './daily-hisab.html',
    './payment-history.html',
    './settings.html',
    './login.html',
    './logo.png',
    './manifest.json',
    // এক্সটার্নাল লাইব্রেরি (CDN)
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
];

// সার্ভিস ওয়ার্কার ইন্সটল করা এবং ফাইলগুলো ক্যাশ করা
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Promise.allSettled ব্যবহার করা হয়েছে যাতে কোনো একটি ফাইল না থাকলেও ইন্সটল বন্ধ না হয়
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(url => cache.add(url))
            );
        })
    );
});

// অফলাইনে ফাইলগুলো ব্রাউজারে দেখানো
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // যদি ক্যাশে ফাইল থাকে তবে সেটি দেখাবে, না থাকলে ইন্টারনেট থেকে নিবে
            return response || fetch(event.request);
        })
    );
});

// পুরনো ক্যাশ ডিলিট করা (ভার্সন আপডেট হলে এটি জরুরি)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
