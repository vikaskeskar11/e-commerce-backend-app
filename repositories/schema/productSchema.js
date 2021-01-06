/**
 * User Schema
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
  name: { type: String, required: true },
  markDelete: {
    type: Boolean, default: false
  },
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'users' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
  modifiedBy: { type: Schema.Types.ObjectId, ref: 'users' }
},
{
  timestamps: {
    createdAt: 'created',
    updatedAt: 'modified'
  }
})
