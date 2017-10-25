import express from 'express'
import { getArticles, archiveArticle } from '../pocket-api'
import {
  getAccessTokenFromDB,
  getLastUpdateTimeFromDB,
  updateTimeStampInDB,
  saveArticlesToDB,
  getArticlesFromDB,
  deleteArticleFromDB,
  dropArticlesCollection,
} from '../db'
import errHandler from '../error-handler'

const router = express.Router()

// Retrieve list of all articles from Pocket and save to DB
router.get('/add', async (req, res) => {
  try {
    const articlesArray = await getArticles(
      await getAccessTokenFromDB(),
      await getLastUpdateTimeFromDB(),
    )
    await saveArticlesToDB(articlesArray)
    await updateTimeStampInDB(articlesArray.since)
    res.sendStatus(200)
  } catch (err) {
    errHandler(err)
  }
})

// Resync articles.
// Drop articles collection and call Pocket API for full resync.
router.get('/resync', async (req, res) => {
  try {
    await dropArticlesCollection()
    res.redirect('/articles/add')
  } catch (err) {
    errHandler(err)
  }
})

// Shuffle array with Fisher-Yates algorithm
// and return requested number of articles.
function shuffleArray(array, limit) {
  const newArray = array
  let counter = array.length
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter)
    counter -= 1;
    [newArray[counter], newArray[index]] = [newArray[index], newArray[counter]]
  }
  return newArray.slice(0, limit)
}

// Return an array of articles for rendering
router.post('/render', async (req, res) => {
  try {
    const token = await getAccessTokenFromDB()
    const lastUpdate = await getLastUpdateTimeFromDB()

    if (!token) res.sendStatus(401)
    if (!lastUpdate) res.sendStatus(204)
    if (token && lastUpdate) {
      // Fetch articles from Pocket to keep the DB up to date
      fetch(`${req.protocol}://${req.get('Host')}/articles/add`)
      // Find articles in DB
      const list = await getArticlesFromDB(req.body.article_length_min, req.body.article_length_max)
      res.send(await shuffleArray(list, req.body.articles_count))
    }
  } catch (err) {
    errHandler(err)
  }
})

// Archive article by ID at Pocket and delete from local DB
router.delete('/:id', async (req, res) => {
  try {
    await archiveArticle(await getAccessTokenFromDB(), req.params.id)
    await deleteArticleFromDB(req.params.id)
    await res.sendStatus(200)
  } catch (err) {
    errHandler(err)
  }
})

export default router
