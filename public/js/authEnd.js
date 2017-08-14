// Authorization Step 3
// On page load convert a request token into a Pocket access token after callback from Pocket
fetch(pocketConfig.url.authorize, {
  method: pocketConfig.method,
  headers: pocketConfig.headers,
  body:
    "consumer_key=" +
    consumerKey +
    "&code=" +
    localStorage.getItem("request_token")
})
  .then(response => response.json())
  // Extract the access_token and save into localStorage
  .then(access_token => {
    localStorage.setItem("access_token", access_token.access_token);
    window.location.href = "http://127.0.0.1:3000/";
  })
  .catch(err => {
    console.log("Error during token obtaining: ", err);
  });
