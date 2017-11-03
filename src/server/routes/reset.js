// @flow

import express from 'express'
import {
  dropArticlesCollection,
  dropTokenCollection,
} from '../db'
import errHandler from '../error-handler'

const router = express.Router()

// Drop all collections from DB
router.delete('/', async (req, res) => {
  try {
    await dropArticlesCollection()
    await dropTokenCollection()
    res.sendStatus(200)
  } catch (err) {
    errHandler(err)
  }
})

export default router
