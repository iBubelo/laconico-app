import 'babel-polyfill'
import 'isomorphic-fetch'

import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import { WEB_PORT, IS_PROD } from '../shared/config'

import auth from './routes/auth'
import articles from './routes/articles'
import reset from './routes/reset'

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Static path
app.use(express.static('public'))

// Routes
app.use('/auth', auth)
app.use('/articles', articles)
app.use('/reset', reset)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');

  res.status(500).json({ message: err.message, error: err })
})

app.listen(WEB_PORT, () => {
  console.log(`Server running on port ${WEB_PORT} ${IS_PROD ? '(production)' : '(development)'}.`)
})
