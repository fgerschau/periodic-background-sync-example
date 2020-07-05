const apiKeyNews = 'API-KEY'; // replace with API key from newsapi.org

const getFormattedTime = (date) => {
  const formatTwoDigits = (number) => `0${number}`.slice(-2);
  const hours = formatTwoDigits(date.getHours());
  const minutes = formatTwoDigits(date.getMinutes());
  const seconds = formatTwoDigits(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
};

const getResponseWithFormattedTime = async (response) => {
  const responseBody = await response.json();
  return new Response(JSON.stringify({
    ...responseBody,
    formattedTime: getFormattedTime(new Date()),
  }));
};

const fetchAndCacheNews = async () => {
  const url = `http://newsapi.org/v2/everything?q=bitcoin&sortBy=publishedAt&apiKey=${apiKeyNews}`;
  const response = await fetch(url);
  const responseWithTime = await getResponseWithFormattedTime(response);

  const cache = await caches.open('cache-news');
  await cache.put(url, responseWithTime);
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

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'news') {
    event.waitUntil(fetchNews());
  }
});

self.addEventListener('message', (event) => {
  if (event.data === 'update-news-cache') {
    fetchAndCacheNews();
  }
});

self.addEventListener('fetch', async (event) => {
  const getResponse = async () => {
    const response = await caches.match(event.request);
    return response || fetch(event.request)
  };

  event.respondWith(getResponse());
});
