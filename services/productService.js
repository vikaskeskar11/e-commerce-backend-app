const logger = require('../logger/logger')
const ProductModel = require('../repositories/models/productModel')

class ProductService {
/**
 * @function
 * @name add
 * @param {JSON} data
 * @param {JSON} currentUser
 * @returns {JSON}
 */
  async add (data, currentUser) {
    logger.debug('ProductService:add: Adding new product')
    data.createdBy = currentUser.userId
    data.modifiedBy = currentUser.userId
    const product = await new ProductModel(data).save()
    logger.info('ProductService:add: Added new product ', { id: product._id })
    return product
  }

  /**
   * @function
   * @name update
   * @param {JSON} data
   * @param {JSON} currentUser
   * @returns {JSON}
   */
  async update (data, currentUser) {
    logger.debug('ProductService:update: Updating product ')
    const productId = data._id
    delete data._id
    data.modifiedBy = currentUser.userId
    let product = await ProductModel.findOneAndUpdate({ _id: productId }, data, { new: true }).lean()
    logger.debug('ProductService:update: Updated product ', { productId })
    return product
  }

  /**
   * @function
   * @name update
   * @param {JSON} data
   * @param {JSON} currentUser
   * @returns {JSON}
   */
  async approve (data, currentUser) {
    const obj = {
      _id: data._id,
      isApproved: true,
      approvedBy: currentUser.userId
    }
    const product = await this.update(obj, currentUser)
    return product
  }

  /**
   * @function
   * @name update
   * @param {JSON} data
   * @param {JSON} currentUser
   * @returns {JSON}
   */
  async delete (data, currentUser) {
    const obj = {
      _id: data._id,
      markDelete: true
    }
    const product = await this.update(obj, currentUser)
    return product
  }

  /**
   * @function
   * @name getAllApproved
   * @returns {Array}
   */
  async getAllApproved () {
    const products = await ProductModel.find({ isApproved: true, markDelete: false })
    return products
  }
}

module.exports = new ProductService()
