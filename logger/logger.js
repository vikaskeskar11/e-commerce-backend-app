/**
 * @file Initialize the log transports (targets to store logs) depending on configurations
 * Following three transports are supported and corresponding configuration to enable or disable
 * 1. MongoDB database (logger.logInDatabase)
 * 2. File (logger.logInFile)
 * 3. Console/Terminal (logger.logOnConsole)
 */

const config = require('config')
const winston = require('winston')
const fs = require('fs')

const transports = []
if (config.logger.logInDatabase) {
  require('winston-mongodb') // eslint-disable-line
  const dbUsername = fs.readFileSync(`/run/secrets/${config.db.auth.usernameFile}`, 'utf8')
  const dbPassword = fs.readFileSync(`/run/secrets/${config.db.auth.passwordFile}`, 'utf8')
  const connectionString = `mongodb://${dbUsername}:${dbPassword}@${config.db.host}/${config.db.logs}?authSource=admin`
  transports.push(new winston.transports.MongoDB({
    db: connectionString,
    level: config.logger.level, // from configuration file
    storeHost: false,
    collection: 'application',
    name: 'databaseLogs',
    tryReconnect: true
  }))
}

// TNA-1026 : All : Error object (like TypeError) in error logs is not visible in mongodb and console.
const enumerateErrorFormat = winston.format(info => {
  if (info.level === 'error' && (info.meta || info.metadata)) {
    let err = (info.meta.err || info.meta.error)
    if (err instanceof Error) {
      info.meta.err = Object.assign({
        message: err.message,
        stack: err.stack,
        code: err.code
      }, err)
    }
  }
  return info
})

// Transport to display logs on console
if (config.logger.logOnConsole) {
  transports.push(new (winston.transports.Console)({
    format: winston.format.combine(
      enumerateErrorFormat(),
      winston.format.json()
    ),
    level: config.logger.level,
    handleExceptions: true
  }))
}

const logger = winston.createLogger({
  format: winston.format.metadata({ key: 'meta' }),
  transports: transports
})
logger.exitOnError = false

module.exports = logger
