// Articles retrieval
// Return articles shorter than article_length words
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
function getRandomArticles(filteredArticlesList, numberOfArticles) {
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
  
  // Shuffle array with Fisher-Yates algorithm and return first numberOfArticles items
  let counter = filteredArticlesList.length;
  while (counter > 0) {
      const index = Math.floor(Math.random() * counter);

      counter--;

      const temp = filteredArticlesList[counter];
      filteredArticlesList[counter] = filteredArticlesList[index];
      filteredArticlesList[index] = temp;
  }

  return filteredArticlesList.slice(0, numberOfArticles)
}

const removeAllChildElements = element => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

// Cycle through all received items; return a list; append to html
const renderArticleListFunction = articlesList => {
  // Select section on the page
  let sectionElement = document.getElementById("articles-list");
  // Purge previous output
  removeAllChildElements(sectionElement);

  // Render list of articles
  articlesList.forEach(function(current_value, index) {
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
    sectionElement.innerHTML += row;
  });

  // Assign value and action to "Archive" button
  articlesList.forEach(function(current_value, index) {
    const articleID = current_value.resolved_id;
    const buttonElement = document.getElementById("archive-button-" + index);
    const articleElement = document.getElementById("article-block-" + index);

    const archiveButtonFunction = articleID => {
      // API call to archive the article
      archiveArticleFunction(articleID);

      // Change button after click
      buttonElement.className = "btn btn-success";
      buttonElement.textContent = "Done";

      // Remove article from the list
      window.setTimeout(() => {
        removeAllChildElements(articleElement);
      }, 1500);
    };

    buttonElement.onclick = archiveButtonFunction.bind(null, articleID);
  });
};

// Archive article
const archiveArticleFunction = item_id => {
  // Request variables
  let actions = [
    {
      action: "archive",
      item_id
    }
  ];
  let body =
    "consumerKey=" +
    consumerKey +
    "&access_token=" +
    localStorage.getItem("access_token") +
    "&actions=" +
    JSON.stringify(actions);
  fetch(pocketConfig.url.modify, {
    method: pocketConfig.method,
    headers: pocketConfig.headers,
    body: body
  }).catch(err => console.log("Ooops!: ", err));
};

// Retrieve articles
const getArticlesFunction = () => {
  // Request variables
  let body =
    "consumer_key=" +
    consumerKey +
    "&access_token=" +
    localStorage.getItem("access_token");

  // Add settings to request
  if (localStorage.getItem("count")) {
    body += "&count=" + localStorage.getItem("count");
  }
  if (localStorage.getItem("content_type")) {
    body += "&contentType=" + localStorage.getItem("content_type");
  }
  if (localStorage.getItem("sort")) {
    body += "&sort=" + localStorage.getItem("sort");
  }
  if (localStorage.getItem("detail_type")) {
    body += "&detailType=" + localStorage.getItem("detail_type");
  }

  // actual request
  fetch(pocketConfig.url.retrieve, {
    method: pocketConfig.method,
    headers: pocketConfig.headers,
    body: body
  })
    // Convert response to json
    .then(response => response.json())
    .then(filterArticlesByLengthFunction)
    .then(response => getRandomArticles(response, numberOfArticles))
    .then(renderArticleListFunction)
    .catch(err => {
      console.log("Ooops!: ", err);
      alert(
        "Something went wrong! If you didn't get any message before go to settings and repeat auth from the beginning."
      );
    });
};
