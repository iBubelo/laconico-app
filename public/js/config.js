/**
 * Global vars
 * 
 * Change consumerKey to your app or use mine.
 * https://getpocket.com/developer/apps/new
 * 
 * Set redirectURI to desired value if you want to deploy on server.
**/
const consumerKey = "67872-e7aa9cb59d605cf8af04b2a2";
const redirectURI = "http://127.0.0.1:3000/auth.html";

/**
 * Pocket API configuration
 * See: https://getpocket.com/developer/docs/overview
**/
const pocketConfig = {
  method: "POST",
  url: {
    request: "https://getpocket.com/v3/oauth/request",
    redirect: "https://getpocket.com/auth/authorize",
    authorize: "https://getpocket.com/v3/oauth/authorize",
    modify: "https://getpocket.com/v3/send",
    retrieve: "https://getpocket.com/v3/get"
  },
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Accept": "application/json"
  }
};

// Default settings values
const defaultSettings = {
  article_length: 1300,
  count: 20,
  sort: "newest",
  detail_type: "simple",
  content_type: "article"
};

// Set default settings on page load
const setDefaultSettingsFunction = (() => {
  Object.keys(defaultSettings).forEach(key => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, defaultSettings[key]);
    }
  });
})();

// Default setting for number of articles in output
const numberOfArticles = 3;