// Authorization
// Obtain request_token
const getRequestTokenFunction = () => {
  fetch(pocketConfig.url.request, {
    method: pocketConfig.method,
    body: "consumer_key=" + consumerKey + "&redirect_uri=" + redirectURI,
    headers: pocketConfig.headers
  })
    // Convert response to json
    .then(response => response.json())
    // Extract the code and save into localStorage
    .then(request_token => {
      localStorage.setItem("request_token", request_token.code)
      alert("Request token successfully obtained. Proceed with the next step.");
    })
    .catch(err => {
      console.log("Ooops!: ", err);
      alert("Something went wrong. Try again.");
    });
};

// Redirect to Pocket auth page
const authorize = () => {
  const url =
    pocketConfig.url.redirect +
    "?request_token=" +
    localStorage.getItem("request_token") +
    "&redirect_uri=" +
    redirectURI;
  window.location.href = url;
};

// Register request_token
const getAccessTokenFunction = () => {
  fetch(pocketConfig.url.authorize, {
    method: pocketConfig.method,
    headers: pocketConfig.headers,
    body:
      "consumer_key=" +
      consumerKey +
      "&code=" +
      localStorage.getItem("request_token") +
      "&redirect_uri=" +
      redirectURI
  })
    // Convert response to json
    .then(response => response.json())
    // Extract the access_token and save into localStorage
    .then(access_token => {
      localStorage.setItem("access_token", access_token.access_token);
      alert('Authorization completed. Return to Read page and click "Get Articles".');
    })
    .catch(err => {
      console.log("Ooops!: ", err);
      alert("Something went wrong. Repeat auth from the beginning.");
    });
};

// Settings and Reset
// Get button by element id
const resetButtonElement = document.getElementById("reset-button");
const saveSettingsButtonElement = document.getElementById("save-settings");

// Set timeout
function delayedToggle(action, delayTime) {
  window.setTimeout(action, delayTime);
};

// Save settings values
function saveSettings() {
  // Set number of articles to retrieve
  const countElement = document.getElementById("count");
  localStorage.setItem("count", countElement.options[countElement.selectedIndex].value);
  // Set length of an article to filter from received list
  const lengthElement = document.getElementById("length");
  localStorage.setItem(
    "article_length",
    lengthElement.options[lengthElement.selectedIndex].value
  );
  // Extract from Pocket by newest/oldest/alphabetically
  const sortElement = document.getElementById("sort");
  localStorage.setItem("sort", sortElement.options[sortElement.selectedIndex].value);
};

saveSettingsButtonElement.addEventListener("click", function() {
  // Save settings to local storage
  saveSettings();
  // Change button after click
  saveSettingsButtonElement.className = "btn btn-success";
  saveSettingsButtonElement.textContent = "Done";
  // Revert to original value after timeout
  delayedToggle(toggleSaveButton, 1200);
});

const toggleSaveButton = () => {
  saveSettingsButtonElement.className = "btn btn-default";
  saveSettingsButtonElement.textContent = "Save";
};

resetButtonElement.addEventListener("click", function() {
  // Clear local storage
  localStorage.clear();
  // Change button on click
  resetButtonElement.className = "btn btn-success";
  resetButtonElement.textContent = "Done";
  // Revert to original value after timeout
  delayedToggle(toggleResetButton, 1200);
});

const toggleResetButton = () => {
  resetButtonElement.className = "btn btn-danger";
  resetButtonElement.textContent = "Reset Authorization & Settings";
};
