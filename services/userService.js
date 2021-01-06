const logger = require('../logger/logger')
const UserModel = require('../repositories/models/userModel')
const tokenUtils = require('../utils/tokenUtils')
const { omitProperties } = require('../utils/generalUtils')

class UserService {
  /**
   * @function
   * @name isUsernameExist
   * @param {string} username - id of user to check against.
   * @returns {Boolean}
   * @description Check user exists or not.
   * */
  async isUsernameExist (username) {
    logger.debug('UserService:isUsernameExist: Checking for username ', { username })
    const isExists = await UserModel.find({ username, markDelete: false }).countDocuments()
    logger.info('UserService:isUsernameExist: ', { isExists })
    return isExists
  }

  /**
   * @function
   * @name add
   * @param {JSON} data - user data.
   * @param {JSON} currentUser - logged in user details.
   * @returns {JSON}
   * @description Add user to database.
   * */
  async add (data, currentUser) {
    logger.debug('UserService:add: Adding new user ', { })
    data.email = data.username
    if (await this.isUsernameExist(data.username)) {
      throw new Error('Username is taken')
    }
    data.createdBy = currentUser.userId
    data.modifiedBy = currentUser.userId
    const user = new UserModel(data)
    let res = await (await user.save()).toObject()
    res = omitProperties(res, ['password'])
    logger.info('UserService:add: User added ')
    return res
  }

  /**
   * @function
   * @name updateUserById
   * @param {JSON} options - Options to update user
   * @param {JSON} currentUser - logged in user details.
   */
  async update (options, currentUser) {
    logger.debug('UserService:update: Updating user ')
    let userId = options['userId']
    let details = options['details']
    if (!userId) {
      throw new Error('required.userId')
    }
    if (!details) {
      throw new Error('User details are missing to update')
    }
    if (details.username) {
      throw new Error('Username can not be updated')
    }
    details.modifiedBy = currentUser.userId
    let user = await UserModel.findOneAndUpdate({ _id: userId }, details, { new: true }).lean()
    logger.debug('UserService:update: Updated user')
    user = omitProperties(user, ['password'])
    return user
  }

  /**
   * @function
   * @name updateUserById
   * @param {JSON} options - Options to update user
   * @param {JSON} currentUser - logged in user details.
   */
  async delete (options, currentUser) {
    logger.debug('UserService:delete: Deleting user ')
    let userId = options['userId']
    if (!userId) {
      throw new Error('required.userId')
    }
    const user = await UserModel.findOneAndUpdate({ _id: userId }, { markDelete: true, modifiedBy: currentUser.userId }, { new: true })
    logger.debug('UserService:delete: Deleted user')
    return user
  }
  /**
   * @function
   * @name verifyCredentials
   * @param {object} data - user credentials.
   * @returns {JSON}
   * @description verify credentials of user.
   */
  async verifyCredentials (data) {
    logger.debug('UserService:verifyCredentials: Verifying credentials ')
    const user = await UserModel.findOne({ username: new RegExp('^' + data.username + '$', 'i'), markDelete: false })
    if (user) {
      // user found
      const isMatch = await user.comparePassword(data.password, user.password)
      logger.debug('UserService:verifyCredentials: ', { isMatch })
      if (isMatch) {
        // valid username and password
        return user
      } else {
        // valid user but invalid password
        throw new Error('error.incorrectCredentials')
      }
    } else {
      // user not found
      throw new Error('error.incorrectCredentials')
    }
  }

  /**
   * @function
   * @name login
   * @param {object} user - user credentials.
   * @returns {JSON}
   * @description Login user and return token.
   */
  async login (user) {
    let data = await this.verifyCredentials(user)
    data = {
      _id: data._id,
      username: data.username,
      role: data.role
    }
    const token = await tokenUtils.generate(data)
    return { data, token }
  }
}

module.exports = new UserService()
