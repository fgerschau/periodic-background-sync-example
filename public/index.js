const createArticleElement = (article) => {
  const element = document.createElement('h2');
  element.textContent = article.title;
  const linkElement = document.createElement('a');
  linkElement.href = article.url;
  linkElement.appendChild(element);

  return linkElement;
};

const fetchNews = async () => {
  const apiKeyNews = 'API-KEY'; // replace with API key from newsapi.org
  const url = `http://newsapi.org/v2/everything?q=bitcoin&sortBy=publishedAt&apiKey=${apiKeyNews}`;
  const response = await fetch(url)
  return response.json();
};

const main = async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
  const news = await fetchNews();

  const articles = news.articles;
  if (articles && articles.length) {
    const newsElement = document.getElementById('news');
    if (!newsElement) return;

    articles.forEach(article => {
      newsElement.appendChild(createArticleElement(article));
    });
  }

  const registration = await navigator.serviceWorker.ready;
  // Check if periodicSync is supported
  if ('periodicSync' in registration) {
    // Request permission
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync',
    });

    if (status.state === 'granted') {
      // Register new sync every 24 hours
      registration.periodicSync.register('update-news-cache', {
        minInterval: 24 * 60 * 60 * 1000, // 1 day
      });
    }
  }
};

main();
