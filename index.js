const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const routes = require('./routes')
const cors = require('cors')
require('./db-connections/connection')
const authMiddleware = require('./route-middleware/authMiddleware')

const app = express()
app.use(cors({ origin: '*' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(logger('common'))
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
global.isDevEnv = app.get('env') === 'development'

app.use('/api', authMiddleware)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

/* Load http routes defined routes/routes.js */
routes.httpsRoutes().forEach((item) => {
  app.use(item.path, item.route)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
