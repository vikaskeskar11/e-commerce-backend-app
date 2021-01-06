const jwt = require('jsonwebtoken')
const config = require('config')

class TokenUtils {
  /**
   * @function
   * @param  {Object} user
   * @returns {Object}
   * @description returns jwt generated token
   */
  async generate (user) {
    const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, config.JWT_TOKEN_KEY)
    return token
  }

  /**
   * @function
   * @param  {String} token
   * @returns {Object}
   * @description returns decoded userId and username
   */
  async verify (token) {
    if (!token) {
      throw new Error('error.tokenNotFound')
    }
    const decoded = await jwt.verify(token, config.JWT_TOKEN_KEY)
    return decoded
  }
}

module.exports = new TokenUtils()
