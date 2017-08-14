// Authorization Step 1. Obtain a request token.
const getRequestToken = () => {
  return fetch(pocketConfig.url.request, {
    method: pocketConfig.method,
    body: "consumer_key=" + consumerKey + "&redirect_uri=" + redirectURI,
    headers: pocketConfig.headers
  })
    .then(response => response.json())
    .then(response => {
      localStorage.setItem("request_token", response.code);
      return response.code;
    });
};

// Authorization Step 2. Redirect to Pocket to continue authorization.
const redirect = requestToken => {
  const url =
    pocketConfig.url.redirect +
    "?request_token=" +
    requestToken +
    "&redirect_uri=" +
    redirectURI;
  window.location.href = url;
};

const authorization = () => {
  getRequestToken().then(response => redirect(response));
};
