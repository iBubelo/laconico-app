// Default settings
const set_dafault_settings = () => {
  if (!localStorage.getItem("article_length")) {
    localStorage.setItem("article_length", "1300");
  }
  if (!localStorage.getItem("count")) {
    localStorage.setItem("count", "20");
  }
  if (!localStorage.getItem("sort")) {
    localStorage.setItem("sort", "newest");
  }
  if (!localStorage.getItem("detail_type")) {
    localStorage.setItem("detail_type", "simple");
  }
  if (!localStorage.getItem("content_type")) {
    localStorage.setItem("content_type", "article");
  }
};
set_dafault_settings();

// Articles retrieval
// Return articles shoter than article_length words
const filter_articles_by_length = array => {
  const list = Object.values(array.list);
  let result = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].word_count < localStorage.getItem("article_length")) {
      result.push(list[i]);
    } else {
      return result;
    }
  }
  return result;
};

// Pick 3 random articles from list
const get_three_randon_articles = articles_list => {
  // Check for corner case
  if (articles_list.length === 0) {
    alert(
      "Oops. There are not enought articles in your Pocket or they are to short. Change settings."
    );
  }

  if (0 < articles_list.length && articles_list.length < 3) {
    alert(
      "Here are few articles. Change settings, if you want to see up to 3 articles."
    );
    return articles_list;
  }

  if (articles_list.length >= 3) {
    let result = [];
    for (let i = 0; result.length < 3; i++) {
      let pick_article =
        articles_list[Math.floor(Math.random() * articles_list.length)];
      if (!result.includes(pick_article)) {
        result.push(pick_article);
      }
    }
    return result;
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
    .then(response => filter_articles_by_length(response))
    .then(response => get_three_randon_articles(response))
    .then(response => render_article_list(response))
    .catch(err => {
      console.log("Ooops!: ", err);
      alert(
        "Something went wrong! If you did get any message before go to settings and repeat auth from the beginning."
      );
    });
};