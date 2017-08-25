// Authorization Step 1. Obtain a request token.
function getRequestToken() {
  return fetch(pocketConfig.url.request, {
    method: pocketConfig.method,
    body: "consumer_key=" + consumerKey + "&redirect_uri=" + redirectURI,
    headers: pocketConfig.headers
  })
    .then(response => response.json())
};

// Authorization Step 2. Redirect to Pocket to continue authorization.
function redirect(requestToken) {
  const url =
    pocketConfig.url.redirect +
    "?request_token=" +
    requestToken +
    "&redirect_uri=" +
    redirectURI;
  window.location.href = url;
};

function authorization() {
  getRequestToken()
    .then(response => {
      localStorage.setItem("request_token", response.code);
      return response.code;
    })
    .then(redirect);
};
