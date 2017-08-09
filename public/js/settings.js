// Authorization
// Obtain request_token
const getRequestTokenFunction = () => {
  // request variables
  const url = "https://getpocket.com/v3/oauth/request";

  // actual request
  fetch(url, {
    method: "POST",
    body: "consumer_key=" + consumer_key + "&redirect_uri=" + redirect_uri,
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		  "X-Accept": "application/json"
    })
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
    "https://getpocket.com/auth/authorize" +
    "?request_token=" +
    localStorage.getItem("request_token") +
    "&redirect_uri=" +
    redirect_uri;
  window.location.href = url;
};

// Register request_token
const getAccessTokenFunction = () => {
  // request variables
  const url = "https://getpocket.com/v3/oauth/authorize";

  // actual request
  fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Accept": "application/json"
    }),
    body:
      "consumer_key=" +
      consumer_key +
      "&code=" +
      localStorage.getItem("request_token") +
      "&redirect_uri=" +
      redirect_uri
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
var save_settings_button = document.getElementById("save-settings");

// Set timeout
delayed_toggle = action => {
  window.setTimeout(action, 1200);
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

save_settings_button.addEventListener("click", function() {
  // Save settings to local storage
  saveSettings();
  // Change button after click
  this.className = "btn btn-success";
  this.textContent = "Done";
  // Revet to original value afer timeout
  delayed_toggle(toggle_save_button);
});

toggle_save_button = () => {
  save_settings_button.className = "btn btn-default";
  save_settings_button.textContent = "Save";
};

resetButtonElement.addEventListener("click", function() {
  // Clear local storage
  localStorage.clear();
  // Change button on click
  resetButtonElement.className = "btn btn-success";
  resetButtonElement.textContent = "Done";
  // Revert to original value after timeout
  delayed_toggle(toggleResetButton);
});

const toggleResetButton = () => {
  resetButtonElement.className = "btn btn-danger";
  resetButtonElement.textContent = "Reset Authorization & Settings";
};