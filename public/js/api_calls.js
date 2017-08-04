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

// Cycle through all received items; return a list; append to html
const render_article_list = filtered_article_list => {
  const articles_list = filtered_article_list;

  // select section on page
  let section = document.getElementById("articles-list");
  section.innerHTML = "";

  for (var i = 0; i < articles_list.length; i++) {
    // Create row for all elements
    let row = document.createElement("div");

    // Create tags for article: link, header for titlw and well for excerpt
    let link = document.createElement("a");
    link.target = "_blank";

    let header = document.createElement("h3");

    let source = document.createElement("p");

    let well = document.createElement("div");
    well.className = "well";

    let excerpt = document.createElement("p");
    excerpt.textContent = "Excerpt from the article:";

    let hr = document.createElement("hr");

    // Assign values to tags
    header.textContent = articles_list[i].resolved_title;
    link.href = articles_list[i].resolved_url;
    well.textContent = articles_list[i].excerpt;
    // Extract hostname from resolved_url with regex
    source.textContent = articles_list[i].resolved_url.match(
      /:\/\/(www[0-9]?\.)?(.[^/:]+)/i
    )[2];
    source.style.fontFamily = "serif";
    source.className = "text-muted";

    // Create archive_button
    let archive_button = document.createElement("button");
    archive_button.className = "btn btn-info";
    archive_button.textContent = "Archive";
    archive_button.href = "#";

    // Assign value and action to button
    let article_id = articles_list[i].resolved_id;
    archive_button.addEventListener("click", function() {
      archive_article(article_id);
      // Change button after click
      this.className = "btn btn-success";
      this.textContent = "Done";
    });

    // Assemble all elemnets
    link.appendChild(header);
    row.appendChild(link);
    row.appendChild(source);
    row.appendChild(excerpt);
    row.appendChild(well);
    row.appendChild(archive_button);
    row.appendChild(hr);

    // Put row into section on the page
    section.appendChild(row);
  }
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
    .then(response => render_article_list(response))
    .catch(err => {
      console.log("Ooops!: ", err);
      alert(
        "Something went wrong! If you did get any message before go to settings and repeat auth from the beginning."
      );
    });
};