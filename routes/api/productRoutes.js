const express = require('express')
const router = express.Router()
const logger = require('../../logger/logger')
const productService = require('../../services/productService')

router.post('', async (req, res) => {
  try {
    logger.info('userRoutes ', req.hostname, req.ip, req.path)
    const user = await productService.add(req.body, req.user)
    res.send({ status: true, user })
  } catch (error) {
    handleError(req, res, error)
  }
})

router.put('', async (req, res) => {
  try {
    logger.info('userRoutes ', req.hostname, req.ip, req.path)
    const user = await productService.update(req.body, req.user)
    res.send({ status: true, user })
  } catch (error) {
    handleError(req, res, error)
  }
})

router.put('/approve', async (req, res) => {
  try {
    logger.info('userRoutes ', req.hostname, req.ip, req.path)
    const user = await productService.approve(req.body, req.user)
    res.send({ status: true, user })
  } catch (error) {
    handleError(req, res, error)
  }
})

router.delete('', async (req, res) => {
  try {
    logger.info('userRoutes:delete: ', req.hostname, req.ip, req.path)
    const user = await productService.delete(req.body, req.user)
    res.send({ status: true, user })
  } catch (error) {
    handleError(req, res, error)
  }
})

router.get('', async (req, res) => {
  try {
    logger.info('userRoutes:delete: ', req.hostname, req.ip, req.path)
    const products = await productService.getAllApproved()
    res.send({ status: true, products })
  } catch (error) {
    handleError(req, res, error)
  }
})

function handleError (req, res, error) {
  logger.error('userRoutes ', { path: req.path, error })
  res.status(403).send({ err: error.message })
}

module.exports = router
