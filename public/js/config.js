// Default settings values
const defaultSettings = {
  article_length_min: 275,
  article_length_max: 825,
  articles_count: 3,
}

// Set default settings on page load
const setDefaultSettingsFunction = (() => {
  Object.keys(defaultSettings).forEach(key => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, defaultSettings[key])
    }
  })
})()
