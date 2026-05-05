const CACHE_NAME = 'sharif-pharma-v10'; // ভার্সন বাড়িয়ে দেওয়া হয়েছে যাতে ব্রাউজার নতুন করে সব আপডেট নেয়
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './details.html',
    './entry-form.html',
    './history.html',
    './daily-hisab.html',
    './paid-entry.html',
    './payment-history.html',
    './settings.html',
    './login.html',
    './logo.png',
    './manifest.json',
    // External Resources
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
];

// ১. সার্ভিস ওয়ার্কার ইন্সটল করা এবং সব ফাইল ক্যাশ করা
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching all assets');
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(url => cache.add(url))
            );
        })
    );
    self.skipWaiting(); // নতুন সার্ভিস ওয়ার্কারকে সাথে সাথে একটিভ করবে
});

// ২. সার্ভিস ওয়ার্কার একটিভ করা এবং পুরনো ক্যাশ ডিলিট করা
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// ৩. অফলাইনে ফাইল সার্ভ করা (প্যারামিটার থাকলেও কাজ করবে)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then((response) => {
            // যদি ক্যাশে ফাইল থাকে তবে সেটি দিবে, না থাকলে নেটওয়ার্ক থেকে নিবে
            return response || fetch(event.request).catch(() => {
                // যদি অফলাইনে এমন কোনো ফাইল ওপেন করতে চান যা ক্যাশে নেই
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
