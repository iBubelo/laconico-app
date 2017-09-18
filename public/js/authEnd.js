// Authorization Step 3
// On page load convert a request token into a Pocket access token after callback from Pocket

// Request to convert request token and return JSON
function convertRequestToken() {
  return fetch(pocketConfig.url.authorize, {
    method: pocketConfig.method,
    headers: pocketConfig.headers,
    body:
      "consumer_key=" +
      consumerKey +
      "&code=" +
      localStorage.getItem("request_token")
  })
  .then(response => response.json());
}

// Save access_token to localStorage and return to main page
function saveAccessToken(accessToken) {
  localStorage.setItem("access_token", accessToken.access_token);
}

function returnToMainPage() {
  window.location.href = "http://127.0.0.1:3000/";
}

function endAuthorization() {
  convertRequestToken()
    .then(saveAccessToken)
    .then(returnToMainPage)
    .catch(err => {
      console.log("Error during token obtaining: ", err);
    });
}
