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

saveSettingsButtonElement.addEventListener("click", () => {
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

resetButtonElement.addEventListener("click", () => {
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
