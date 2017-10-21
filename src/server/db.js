import 'babel-polyfill'
import mongoose from 'mongoose'
import errHandler from './error-handler'

mongoose.connect('mongodb://localhost/laconico_db', {
  useMongoClient: true,
})
// Notify if connection to Mongo DB wasn't successful
mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
mongoose.Promise = global.Promise

// Define schemas
const Schema = mongoose.Schema

// Tokens for authentication and authorization
// There should be only one document of this kind in DB
const tokenSchema = new Schema(
  {
    request_token: String,
    access_token: String,
  },
  { versionKey: false },
)

const articleSchema = new Schema(
  {
    item_id: { type: Number },
    resolved_id: { type: Number },
    given_url: { type: String },
    given_title: { type: String },
    resolved_title: { type: String },
    resolved_url: { type: String },
    excerpt: { type: String },
    word_count: { type: Number },
  },
  {
    versionKey: false,
  },
)

// Time stamp of last Pocket API call
// There should be only one document of this kind in DB
const timeSchema = new Schema({ last_update: Number }, { versionKey: false })

// Compile schemas into models
const Token = mongoose.model('Token', tokenSchema)
const Article = mongoose.model('Article', articleSchema)
const Update = mongoose.model('Date', timeSchema)


// Look for request token in DB
function getRequestTokenFromDB() {
  return Token.findOne()
    // eslint-disable-next-line arrow-body-style
    .then(result => {
      return result ? result.request_token : null
    })
}

// Look for access token in DB
function getAccessTokenFromDB() {
  return Token.findOne()
    // eslint-disable-next-line arrow-body-style
    .then(result => {
      return result ? result.access_token : null
    })
}

// Create a new request token if missing or update existing one in DB
function saveOrUpdateRequestTokenInDB(token) {
  Token.findOne().exec((error, item) => {
    errHandler(error)
    !item
      ? Token.create({ request_token: token }, err => errHandler(err))
      : Token.findOneAndUpdate({}, { request_token: token }, err => errHandler(err))
  })
}

// Save access token to DB
function saveAccessTokenToDB(token) {
  Token.findOneAndUpdate({}, { access_token: token }, err => errHandler(err))
}

// Get time stamp of last Pocket API call from DB
function getLastUpdateTimeFromDB() {
  return Update.findOne()
    // eslint-disable-next-line arrow-body-style
    .then(result => {
      return result ? result.last_update : null
    })
}

// Create of update time stamp of last Pocket API call from DB
async function updateTimeStampInDB(receivedTimeStamp) {
  try {
    await getLastUpdateTimeFromDB()
      ? Update.findOneAndUpdate({}, { last_update: receivedTimeStamp }, err => errHandler(err))
      : Update.create({ last_update: receivedTimeStamp }, err => errHandler(err))
  } catch (err) {
    console.log(err)
  }
}

// Save Pocket API call output into DB
function saveArticlesToDB(jsonArray) {
  const listOfArticles = Object.values(jsonArray.list)

  listOfArticles.forEach(entry => {
    Article.findOne({ item_id: entry.item_id }, (err, item) => {
      if (!item) {
        Article.create({
          item_id: entry.item_id,
          resolved_id: entry.resolved_id,
          given_url: entry.given_url,
          given_title: entry.given_title,
          resolved_title: entry.resolved_title,
          resolved_url: entry.resolved_url,
          excerpt: entry.excerpt,
          word_count: entry.word_count,
        })
      }
    })
  })
}

// Find articles in DB based on word count
function getArticlesFromDB(minWordCount, maxWordCount) {
  return Article.find({
    $and: [{ word_count: { $gte: minWordCount } }, { word_count: { $lte: maxWordCount } }],
  }).select({ _id: 0, item_id: 1, resolved_url: 1, resolved_title: 1, excerpt: 1 })
}

// Delete an article by ID from DB
function deleteArticleFromDB(id) {
  return Article.findOneAndRemove({ item_id: id }, err => errHandler(err))
}

// Drop Articles and Dates collection from DB
function dropArticlesCollection() {
  mongoose.connection.db.dropCollection('articles', err => errHandler(err))
  mongoose.connection.db.dropCollection('dates', err => errHandler(err))
}

// Drop Tokens collection from DB
function dropTokenCollection() {
  mongoose.connection.db.dropCollection('tokens', err => errHandler(err))
}

export {
  saveOrUpdateRequestTokenInDB,
  getRequestTokenFromDB,
  getAccessTokenFromDB,
  saveAccessTokenToDB,
  getLastUpdateTimeFromDB,
  updateTimeStampInDB,
  saveArticlesToDB,
  getArticlesFromDB,
  deleteArticleFromDB,
  dropArticlesCollection,
  dropTokenCollection,
}
