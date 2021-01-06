const mongoose = require('mongoose')
const config = require('config')
const fs = require('fs')
const logger = require('../logger/logger')
const { isDevEnv } = require('../utils/generalUtils')
mongoose.set('debug', isDevEnv())

/**
 * create mongoose connection for DBs
 * @param configName String
 * @returns
//  */
let isConnectedBefore = false
const connect = async function () {
  const mongoPassword = fs.readFileSync(`/run/secrets/${config.db.auth.passwordFile}`, 'utf8')
  const mongoUsername = fs.readFileSync(`/run/secrets/${config.db.auth.usernameFile}`, 'utf8')
  var url = `mongodb://${mongoUsername}:${mongoPassword}@${config.db.host}/${config.db.name}?authSource=admin`
  await mongoose.connect(url, {
    useFindAndModify: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
}
mongoose.connection.on('error', function () {
  logger.info('Could not connect to MongoDB')
})
mongoose.connection.on('disconnected', function () {
  logger.info('Lost MongoDB connection!')
  if (!isConnectedBefore) setTimeout(connect, 5000)
})
mongoose.connection.on('connected', function () {
  if (!isConnectedBefore) {
    require('../init-data/init')
  }
  isConnectedBefore = true
  logger.info('Connection established to MongoDB')
})
mongoose.connection.on('reconnected', function () {
  logger.info('Reconnected to MongoDB')
})
module.exports = connect()
