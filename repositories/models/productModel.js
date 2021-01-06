/**
 * Product Model
 */
const mongoose = require('mongoose')
const productSchema = require('../schema/productSchema')

module.exports = mongoose.model('product', productSchema, 'products')
