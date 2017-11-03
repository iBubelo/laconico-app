// @flow

/**
 * Global vars
 * 
 * Change consumerKey to your app or use mine.
 * https://getpocket.com/developer/apps/new
 * 
 * Set redirectURI to desired value if you want to deploy on server.
*/
const consumerKey = '67872-e7aa9cb59d605cf8af04b2a2'
const redirectURI = 'http://127.0.0.1:3000/auth/done'

/**
 * Pocket API configuration
 * See: https://getpocket.com/developer/docs/overview
*/
const pocketConfig = {
  method: 'POST',
  url: {
    request: 'https://getpocket.com/v3/oauth/request',
    redirect: 'https://getpocket.com/auth/authorize',
    authorize: 'https://getpocket.com/v3/oauth/authorize',
    modify: 'https://getpocket.com/v3/send',
    retrieve: 'https://getpocket.com/v3/get',
  },
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Accept': 'application/json',
  },
  body: `consumer_key=${consumerKey}`,
}

// Authorization Step 1. Obtain a request token.
function getRequestToken(): Promise<string> {
  return (
    fetch(pocketConfig.url.request, {
      method: pocketConfig.method,
      headers: pocketConfig.headers,
      body: `${pocketConfig.body}&redirect_uri=${redirectURI}`,
    })
      .then(result => result.json())
      .then(json => json.code)
  )
}

// Authorization Step 2. Redirect to Pocket to continue authorization.
function redirectPath(token: string) {
  return `${pocketConfig.url.redirect}?request_token=${token}&redirect_uri=${redirectURI}`
}

// Authorization Step 3
// Convert request token into access token
function convertRequestToken(code: string): Promise<string> {
  return fetch(pocketConfig.url.authorize, {
    method: pocketConfig.method,
    headers: pocketConfig.headers,
    body: `${pocketConfig.body}&code=${code}`,
  })
    .then(result => result.json())
    .then(json => json.access_token)
}

// Retrieve articles from Pocket for storing in DB
function getArticles(token: string, timeStamp: number): Object {
  let body = `${pocketConfig.body}&access_token=${token}`

  // Add time stamp of last API call to request if exist
  if (timeStamp) {
    body += `&since=${timeStamp}`
  }

  return fetch(pocketConfig.url.retrieve, {
    method: pocketConfig.method,
    headers: pocketConfig.headers,
    body,
  })
    .then(response => response.json())
}

// Archive an article based on ID
// eslint-disable-next-line
function archiveArticle(token: string, item_id: number) {
  const actions = [
    {
      action: 'archive',
      item_id,
    },
  ]

  fetch(pocketConfig.url.modify, {
    method: pocketConfig.method,
    headers: pocketConfig.headers,
    body: `${pocketConfig.body}&access_token=${token}&actions=${JSON.stringify(actions)}`,
  })
}

export {
  redirectURI,
  pocketConfig,
  getRequestToken,
  redirectPath,
  convertRequestToken,
  getArticles,
  archiveArticle,
}
