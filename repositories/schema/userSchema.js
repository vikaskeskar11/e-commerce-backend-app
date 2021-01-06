/**
 * User Schema
 */
const mongoose = require('mongoose')
const constants = require('../../constants/constants')
const Schema = mongoose.Schema

module.exports = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  role: { type: String, default: constants.roles.USER },
  markDelete: {
    type: Boolean, default: false
  }
},
{
  timestamps: {
    createdAt: 'created',
    updatedAt: 'modified'
  }
})
