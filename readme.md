# Laconico

Laconico is a small app that retrieves random short articles from your [Pocket](https://getpocket.com/) list.

Laconico is a pet project and was meant for my personal educational purposes.
Current stack: ES6, Node.js, Express, Mongoose, MongoDB, Nodemon, Babel, ESLint, PM2.

## Installation
Prerequisites:
- node and npm
- MongoDB
- nodemon and pm2 installed as global packages

### Loading Dependencies:
Clone this repo, go to the folder, install dependencies.
```bash
$ git clone https://github.com/iBubelo/laconico-app.git
$ cd laconico-app
$ npm install
```
Run in Dev mode:
```bash
$ npm start
```
Or build and run in Production mode:
```bash
$ npm run prod:build
$ npm run prod:start
```

## Usage
- Go to 127.0.0.1:3000
- Go to Settings page and authorize
- Set the desired settings
- Return to Read page and click "Get Articles" button

## Troubleshooting
1. Try Resync and Full Reset buttons in Settings.
2. Clear the tokens associated with this app, by going to: http://getpocket.com/connected_accounts.
3. Go through authorization process once again from the beginning
4. Check dev console. There may be a clue.

## Known issues
- ~~The tab with the app can freeze when you don't have enough articles in your Pocket (or selected read time is too short) and click "Get Articles" button. You will see helper process gobbling up 100% CPU too.~~
- When something is wrong sometimes there is no GUI for that. Yet.
- ~~"Get Access Token" button returns successful alert even when it failed.~~
- ~~Chrome is not supported because of Access-Control-Allow-Origin issue~~

## To Do
- ~~Get rid of Access-Control-Allow-Origin issue~~
- ~~Simplify authorization process~~
- ~~Add error handlers~~
- Improve UI and UX

## Credits
App icon by [Rooty](https://thenounproject.com/term/news/1095762/#)
[Creative Commons](https://creativecommons.org/licenses/by/3.0/us/)