// @flow

import express from 'express'
import {
  getRequestToken,
  redirectPath,
  convertRequestToken,
} from '../pocket-api'
import {
  getRequestTokenFromDB,
  saveOrUpdateRequestTokenInDB,
  saveAccessTokenToDB,
} from '../db'
import errHandler from '../error-handler'

const router = express.Router()

// Authorization steps 1 & 2. Obtain a request token and redirect to Pocket
router.get('/', async (req, res) => {
  try {
    // Call Pocket fot request token
    const token = await getRequestToken()
    // Save or update token in DB
    await saveOrUpdateRequestTokenInDB(token)
    // Redirect with request token
    res.redirect(redirectPath(token))
  } catch (err) {
    errHandler(err)
  }
})

// Authorization step 3
// Receive a callback from Pocket and convert request token into access token
router.get('/done', async (req, res) => {
  try {
    // Find request token in DB and convert it to access token
    const rawAccessToken = await convertRequestToken(await getRequestTokenFromDB())
    // Save access token to DB
    await saveAccessTokenToDB(rawAccessToken)
    // End authorization and return to main page
    res.redirect('/')
  } catch (err) {
    errHandler(err)
  }
})

export default router
