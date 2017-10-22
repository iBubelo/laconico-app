// Articles retrieval
function removeAllChildElements(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

// Archive article by ID
function archiveArticle(id) {
  try {
    fetch(`/articles/${id}`, { method: 'DELETE' })
  } catch (err) {
    console.log(err)
  }
}

// Cycle through all received items; return a list; append to html
function renderArticleList(articlesList) {
  // Select section on the page
  const sectionElement = document.getElementById('articles-list')
  // Purge previous output
  removeAllChildElements(sectionElement)

  // Render list of articles
  articlesList.forEach((currentValue, index) => {
    const { resolved_title: title, resolved_url: link, excerpt } = currentValue

    // Extract hostname from resolved_url with regex
    const source = link.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)[2]

    const row = `
    <div id='article-block-${index}'>
      <a target='_blank' rel='noopener noreferrer' href='${link}'>
        <h3>
          ${title}
        </h3>
      </a>
      <p class='text-muted' style='font-family: serif;'>
        ${source}
      </p>
      <p>
        Excerpt from the article:
      </p>
      <div class='well'>
        ${excerpt}
      </div>
      <button id='archive-button-${index}' class='btn btn-info'>
        Archive
      </button>
      <hr>
    </div>
    `

    // Add row into section on the page
    sectionElement.innerHTML += row
  })

  // Assign value and action to "Archive" button
  articlesList.forEach((currentValue, index) => {
    const articleId = currentValue.item_id
    const buttonElement = document.getElementById(`archive-button-${index}`)
    const articleElement = document.getElementById(`article-block-${index}`)

    function archiveButton(id) {
      // API call to archive the article
      archiveArticle(id)

      // Change button after click
      buttonElement.className = 'btn btn-success'
      buttonElement.textContent = 'Done'

      // Remove article from the list
      window.setTimeout(() => {
        removeAllChildElements(articleElement)
      }, 1500)
    }

    buttonElement.onclick = archiveButton.bind(null, articleId)
  })
}

// Save articles to DB
function saveArticles() {
  try {
    fetch('/articles/add')
  } catch (err) {
    console.log(err)
  }
}

// Render articles or redirect to another API call in case of an issue
// eslint-disable-next-line no-unused-vars
async function renderArticles() {
  // Get settings fom Local Storage
  const body = {
    articles_count: localStorage.getItem('articles_count'),
    article_length_min: localStorage.getItem('article_length_min'),
    article_length_max: localStorage.getItem('article_length_max'),
  }

  try {
    const res = await fetch('/articles/render',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

    // Redirect to setting if there is no access token in DB
    if (res.status === 401) {
      window.location.href = '/settings.html'
    // Make an API call if there is no articles in DB yet and repeat this call
    } else if (res.status === 204) {
      const response = await saveArticles()
      if (response.ok) renderArticles()
    // Render articles if everything is normal
    } else {
      const data = await res.json()
      await renderArticleList(data)
    }
  } catch (err) {
    console.log(err)
    // eslint-disable-next-line no-alert
    alert('Something went wrong! Try again or resync articles from settings.')
  }
}
