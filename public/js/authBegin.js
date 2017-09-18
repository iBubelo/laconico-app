// Authorization Step 1. Obtain a request token.
function getRequestToken() {
  return fetch(pocketConfig.url.request, {
    method: pocketConfig.method,
    headers: pocketConfig.headers,
    body: "consumer_key=" + consumerKey + "&redirect_uri=" + redirectURI
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

function extractRequestToken(response) {
  return response.code;
}

function saveRequestToken(requestToken) {
  localStorage.setItem("request_token", requestToken);
}

function beginAuthorization() {
  getRequestToken()
    .then(extractRequestToken)
    .then(response => {
      saveRequestToken(response);
      redirect(response);
    })
    .catch(err => {
      console.log("Error during token request: ", err);
    });
};
