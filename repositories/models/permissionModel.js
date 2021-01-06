/**
 * Permission Model
 */
const mongoose = require('mongoose')
const rolesSchema = require('../schema/rolesSchema')

module.exports = mongoose.model('role', rolesSchema, 'roles')
