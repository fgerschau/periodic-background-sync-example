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
};

main();
