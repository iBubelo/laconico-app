// Default settings values
const defaultSettings = {
  article_length: 1300,
  count: 20,
  sort: "newest",
  detail_type: "simple",
  content_type: "article"
};

// Set default settings
const setDefaultSettingsFunction = (() => {
  Object.keys(defaultSettings).forEach(key => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, defaultSettings[key]);
    }
  });
})();

// Articles retrieval
// Return articles shoter than article_length words
const filterArticlesByLengthFunction = array => {
  const list = Object.values(array.list);
  const result = list.reduce((acc, value) => {
    if (value.word_count < localStorage.getItem("article_length")) {
      acc.push(value);
    }
    return acc;
  }, []);
  return result;
};

// Pick 3 random articles from list
const getRandomArticlesFunction = filteredArticlesList => {
  // To-Do: allow this value to be changed in settings
  const numberOfArticles = 3;

  // Check for corner case
  if (filteredArticlesList.length < numberOfArticles) {
    alert(
      "If there are no (too few) articles, change settings to display more"
    );
    return filteredArticlesList;
  }

  // Do nothing if the list is too short
  if (filteredArticlesList.length === numberOfArticles) {
    return filteredArticlesList;
  }

  // Randomize and reduce the list to numberOfArticles, if the length is sufficient
  if (filteredArticlesList.length > numberOfArticles) {
    let currentListOfArticles = filteredArticlesList;
    let newListOfArticles = [];

    while (newListOfArticles.length !== numberOfArticles) {
      let pick_article =
        currentListOfArticles[
          Math.floor(Math.random() * currentListOfArticles.length)
        ];
      if (!newListOfArticles.includes(pick_article)) {
        newListOfArticles.push(pick_article);
        // Remove above added article from currentListOfArticles
        currentListOfArticles.splice(pick_article, 1);
      }
    }
    return newListOfArticles;
  }
};

const removeAllChildElements = element => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

// Cycle through all received items; return a list; append to html
const renderArticleListFunction = articles_list => {
  // Select section on the page
  let section = document.getElementById("articles-list");
  // Purge previous output
  removeAllChildElements(section);

  // Render list of articles
  articles_list.forEach(function(current_value, index) {
    const title = current_value.resolved_title;
    const link = current_value.resolved_url;
    const excerpt = current_value.excerpt;

    // Extract hostname from resolved_url with regex
    const source = current_value.resolved_url.match(
      /:\/\/(www[0-9]?\.)?(.[^/:]+)/i
    )[2];

    let row = `
    <div id='article-block-${index}'>
      <a target='_blank' href='${link}'><h3>${title}</h3></a>
      <p class='text-muted' style='font-family: serif;'>${source}</p>
      <p>Excerpt from the article:</p>
      <div class='well'>${excerpt}</div>
      <button id='archive-button-${index}' class='btn btn-info' href='#'>Archive</button>
      <hr>
    </div>
    `;

    // Add row into section on the page
    section.innerHTML += row;
  });

  // Assign value and action to "Archive" button
  articles_list.forEach(function(current_value, index) {
    const article_id = current_value.resolved_id;
    const button = document.getElementById("archive-button-" + index);
    const article = document.getElementById("article-block-" + index);

    const archiveButtonFunction = article_id => {
      // API call to archive the article
      archive_article(article_id);

      // Change button after click
      button.className = "btn btn-success";
      button.textContent = "Done";

      // Remove article from the list
      window.setTimeout(() => {
        removeAllChildElements(article);
      }, 1500);
    };

    button.onclick = archiveButtonFunction.bind(null, article_id);
  });
};

// Archive article
const archive_article = item_id => {
  const url = "https://getpocket.com/v3/send";
  let actions = [
    {
      action: "archive",
      item_id: item_id
    }
  ];
  let body =
    "consumer_key=" +
    consumer_key +
    "&access_token=" +
    localStorage.getItem("access_token") +
    "&actions=" +
    JSON.stringify(actions);
  fetch(url, {
    method: "POST",
    body: body,
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded"
    })
  }).catch(err => console.log("Ooops!: ", err));
};

// Retrieve articles
const get_articles = () => {
  // Request variables
  const url = "https://getpocket.com/v3/get";
  let body =
    "consumer_key=" +
    consumer_key +
    "&access_token=" +
    localStorage.getItem("access_token");

  // Add settings to request
  if (localStorage.getItem("count")) {
    body = body + "&count=" + localStorage.getItem("count");
  }
  if (localStorage.getItem("content_type")) {
    body = body + "&contentType=" + localStorage.getItem("content_type");
  }
  if (localStorage.getItem("sort")) {
    body = body + "&sort=" + localStorage.getItem("sort");
  }
  if (localStorage.getItem("detail_type")) {
    body = body + "&detailType=" + localStorage.getItem("detail_type");
  }

  // actual request
  fetch(url, {
    method: "POST",
    // mode: 'no-cors',
    body: body,
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded"
    })
  })
    // Convert response to json
    .then(response => {
      return response.json();
    })
    .then(response => filterArticlesByLengthFunction(response))
    .then(response => getRandomArticlesFunction(response))
    .then(response => renderArticleListFunction(response))
    .catch(err => {
      console.log("Ooops!: ", err);
      alert(
        "Something went wrong! If you did get any message before go to settings and repeat auth from the beginning."
      );
    });
};
