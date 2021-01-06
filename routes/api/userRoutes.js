const express = require('express')
const router = express.Router()
const logger = require('../../logger/logger')
const userService = require('../../services/userService')

router.post('/login', async (req, res) => {
  try {
    logger.info('userRoutes ', req.hostname, req.ip, req.path)
    const user = await userService.login(req.body)
    res.status(200).send(user)
  } catch (error) {
    handleError(req, res, error)
  }
})

router.post('', async (req, res) => {
  try {
    logger.info('userRoutes ', req.hostname, req.ip, req.path)
    const user = await userService.add(req.body)
    res.send({ status: true, user: user })
  } catch (error) {
    handleError(req, res, error)
  }
})

router.put('', async (req, res) => {
  try {
    logger.info('userRoutes ', req.hostname, req.ip, req.path)
    const user = await userService.updateUserById(req.body)
    res.send({ status: true, user: user })
  } catch (error) {
    handleError(req, res, error)
  }
})

router.delete('', async (req, res) => {
  try {
    logger.info('userRoutes:delete: ', req.hostname, req.ip, req.path)
    const user = await userService.updateUserById(req.body)
    res.send({ status: true, user: user })
  } catch (error) {
    handleError(req, res, error)
  }
})

router.get('/info', async (req, res, next) => {
  try {
    logger.info('info', { host: req.hostname, ip: req.ip, path: req.path })
    const user = await userService.getUserById(req.user.userId)
    res.send(user)
  } catch (error) {
    handleError(req, res, error)
  }
})

function handleError (req, res, error) {
  logger.error('userRoutes ', { path: req.path, error })
  res.status(403).send({ err: error.message })
}

module.exports = router
