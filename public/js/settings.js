// Settings and Reset
// Get button by element id
const saveSettingsButtonElement = document.getElementById('save-settings')
const resyncButtonElement = document.getElementById('resync-button')
const resetButtonElement = document.getElementById('reset-button')

// Set timeout
function delayedToggle(action, delayTime) {
  window.setTimeout(action, delayTime)
}

// Save settings values
function saveSettings() {
  // Set number of articles to retrieve
  const countElement = document.getElementById('count')
  localStorage.setItem('articles_count', countElement.options[countElement.selectedIndex].value)
  // Set min and max length of an article to filter from received list
  const minLengthElement = document.getElementById('length-min')
  localStorage.setItem('article_length_min', minLengthElement.options[minLengthElement.selectedIndex].value)
  const maxLengthElement = document.getElementById('length-max')
  localStorage.setItem('article_length_max', maxLengthElement.options[maxLengthElement.selectedIndex].value)
}

function toggleSaveButton() {
  saveSettingsButtonElement.className = 'btn btn-default'
  saveSettingsButtonElement.textContent = 'Save'
}

saveSettingsButtonElement.addEventListener('click', () => {
  // Save settings to local storage
  saveSettings()
  // Change button after click
  saveSettingsButtonElement.className = 'btn btn-success'
  saveSettingsButtonElement.textContent = 'Done'
  // Revert to original value after timeout
  delayedToggle(toggleSaveButton, 1200)
})

// API call to resync articles
function resyncArticles() {
  try {
    fetch('/articles/resync')
  } catch (err) {
    console.error(err)
  }
}

function toggleResyncButton() {
  resyncButtonElement.className = 'btn btn-default'
  resyncButtonElement.textContent = 'Resync Articles'
}

resyncButtonElement.addEventListener('click', async () => {
  try {
    await resyncArticles()
    // Change button on click
    resyncButtonElement.className = 'btn btn-success'
    resyncButtonElement.textContent = 'Done'
    // Revert to original value after timeout  
    delayedToggle(toggleResyncButton, 1200)
  } catch (err) {
    // Show the error to the user
    resetButtonElement.className = 'btn btn-warning'
    resetButtonElement.textContent = 'Error!'
    delayedToggle(toggleResyncButton, 1200)
  }
})

// Call API for full app reset
function fullReset() {
  try {
    fetch('/reset', { method: 'DELETE' })
  } catch (err) {
    console.error(err)
  }
}

function toggleResetButton() {
  resetButtonElement.className = 'btn btn-danger'
  resetButtonElement.textContent = 'Reset Authorization & Settings'
}

resetButtonElement.addEventListener('click', async () => {
  try {
    // Clear local storage and call for full reset
    localStorage.clear()
    await fullReset()
    // Change button on click
    resetButtonElement.className = 'btn btn-success'
    resetButtonElement.textContent = 'Done'
    // Revert to original value after timeout
    delayedToggle(toggleResetButton, 1200)
  } catch (err) {
    // Show the error to the user
    resetButtonElement.className = 'btn btn-warning'
    resetButtonElement.textContent = 'Error!'
    delayedToggle(toggleResetButton, 1200)
  }
})
