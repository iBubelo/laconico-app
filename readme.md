# Laconico

Laconico is a small app that retrieves random short articles from your [Pocket](https://getpocket.com/) list.
You can try Laconico [here](http://laconico.surge.sh) without local installation.

Laconico is a pet project and was meant for my personal educational purposes.

## Installation
Prerequisites:
- node and npm
- Safari ~~or Google Chrome~~

In Safari: Preferences>Advances>Show Develop menu and select "Disable Cross-Origin Restrictions" from the Develop menu.

~~In Chrome: install extension [Access-Control-Allow-Origin: *](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi)~~

### Loading Dependencies:

Clone this repo, go to the folder, install dependencies.
```bash
$ git clone git@github.com:iBubelo/laconico-app.git
$ cd laconico-app
$ npm install --production
```
Run the app:
```bash
$ npm start
```

## Usage
- Go to 127.0.0.1:3000
- Check that "Disable Cross-Origin Restrictions" in Safari is selected ~~or [Access-Control-Allow-Origin](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi) Chrome extension is installed and running~~
- Go to Settings page and click through authorization buttons
- Set the desired settings
- Return to Read page and click "Get Articles" button

## Troubleshooting
1. ~~In Chrome: check that Access-Control-Allow-Origin is running. Even if the icon is green you should explicitly click on the icon.~~
2. Clear the tokens associated with this app, by going to: http://getpocket.com/connected_accounts.
3. Clear local storage
4. Go through authorization process once again from the beginning
5. Check dev console. There may be a clue.

## Known issues
- ~~The tab with the app can freeze when you don't have enough articles in your Pocket (or selected read time is too short) and click "Get Articles" button. You will see helper process gobbling up 100% CPU too.~~
- When something is wrong sometimes there is no GUI for that. Yet.
- "Get Access Token" button returns successful alert even when it failed.
- Chrome is not supported because of Access-Control-Allow-Origin issue 

## To Do
- Get rid of Access-Control-Allow-Origin issue
- Simplify authorization process
- Add error handlers
- Improve UI and UX

## Credits
App icon by [Rooty](https://thenounproject.com/term/news/1095762/#)
[Creative Commons](https://creativecommons.org/licenses/by/3.0/us/)