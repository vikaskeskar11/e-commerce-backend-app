const tokenUtils = require('../utils/tokenUtils')
const logger = require('../logger/logger')
const { PATH_PERMISSIONS } = require('../constants/constants')
// Provide direct access to route if it exists in nonSecurePath as it does not require authentication
const nonSecurePath = ['/user/login']
module.exports = async (req, res, next) => {
  if (nonSecurePath.includes(req.path)) {
    next()
  } else {
    try {
      const token = req.headers.authorization || ''
      const userInfo = await tokenUtils.verify(token.substr('Bearer '.length, token.length))
      if (validateRole(req.path, req.method, userInfo)) {
        req.user = userInfo
        next()
      } else {
        throw new Error('You do not have permission')
      }
    } catch (error) {
      logger.error('authMiddleware ', { hostname: req.hostname, path: req.path, error: error })
      res.status(400).send({ error: error.message })
    }
  }
}

function validateRole (path, method, user) {
  return !!PATH_PERMISSIONS.find(permission => permission.path && permission.method === method && permission.roles.indexOf(user.role) > -1)
}
