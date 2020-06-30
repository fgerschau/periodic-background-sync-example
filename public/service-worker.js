const apiKeyNews = 'API-KEY'; // replace with API key from newsapi.org

const fetchAndCacheNews = async () => {
  const url = `http://newsapi.org/v2/everything?q=bitcoin&sortBy=publishedAt&apiKey=${apiKeyNews}`;
  const response = await fetch(url);

  const cache = await caches.open('cache-news');
  return cache.put(url, response);
};

self.addEventListener('install', (event) => {
  const preCache = async () => {
    await fetchAndCacheNews();
    const cache = await caches.open('cache-v1');
    await cache.addAll([
      '/',
      '/index.js',
      '/index.html',
    ]);
  };

  event.waitUntil(preCache());
});

self.addEventListener('fetch', async (event) => {
  const getResponse = async () => {
    const response = await caches.match(event.request);
    return response || fetch(event.request)
  };

  event.respondWith(getResponse());
});
