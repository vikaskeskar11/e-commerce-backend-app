const userService = require('../services/userService')
const fs = require('fs')
const config = require('config')
const logger = require('../logger/logger')
const { adminUser } = require('../constants/constants');

(async () => {
  logger.info('InitScript: Initializing')
  try {
    const username = fs.readFileSync(`/run/secrets/${config.adminUser.usernameFile}`, 'utf8')
    const isExists = await userService.isUsernameExist(username)
    if (!isExists) {
      const password = fs.readFileSync(`/run/secrets/${config.adminUser.passwordFile}`, 'utf8')
      const user = Object.assign({ username, password }, adminUser)
      await userService.add(user)
      logger.info('InitScript: Added user')
    }
  } catch (error) {
    logger.error('InitScript: Error during initialization', { error })
  }
})()
