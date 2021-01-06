/**
 * User Model
 */
const mongoose = require('mongoose')
const userSchema = require('../schema/userSchema')
const bcrypt = require('bcryptjs')
const constants = require('../../constants/constants')

const deepPopulate = require('mongoose-deep-populate')(mongoose)
userSchema.plugin(deepPopulate)

userSchema.pre('save', async function (next) {
  const user = this

  if (!this.isNew && !this.isModified('password')) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(constants.SALT_WORK_FACTOR)
    const hash = await bcrypt.hash(user.password, salt)
    user.password = hash
    next()
  } catch (error) {
    next(error)
  }
})

// Statics
userSchema.statics.isUsernameExist = async function (username) {
  const count = await this.find({ username: username }).count().exec()
  return count > 0
}

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  const hash = await bcrypt.compare(candidatePassword, this.password)
  return hash
}

module.exports = mongoose.model('user', userSchema, 'users')
