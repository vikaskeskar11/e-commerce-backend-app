/**
 * @file
 * Contains health check related routes
 */
const packageInfo = require('../../package.json')
const logger = require('../../logger/logger')
const os = require('os')
const express = require('express')
const router = express.Router()

router.get('/health', async (req, res) => {
  res.send()
})

router.get('', async (req, res) => {
  try {
    logger.debug('HealthCheckRoutes:healthCheck: Instance  health', { name: packageInfo.name, hostname: os.hostname(), os: os.platform() })
    res.send({ name: packageInfo.name, runningOn: req.headers.host, hostname: os.hostname(), os: os.platform(), version: packageInfo.version })
  } catch (error) {
    logger.error('HealthCheckRoutes:healthCheck: Failed to send health check ', { error })
    res.status(500).send(error)
  }
})

module.exports = router
