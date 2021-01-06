
class GeneralUtils {
  /**
   * @param {String} string
   * @returns {Boolean}
   * @description returns boolean by checking if provided string is null or empty or undefined
   */
  isNullOrEmpty (string) {
    return !!(string === '' || string === null || string === undefined)
  }

  /**
   * @param {String} string
   * @returns {Boolean}
   * @description Returns true if development environment
   */
  isDevEnv () {
    return process.env.NODE_ENV === 'development'
  }

  /**
   * @param {JSON} obj
   * @param {Array} properties
   * @description This function will delete specified properties from object
   */
  omitProperties (obj, properties) {
    properties.forEach((property) => {
      if (obj[property]) delete obj[property]
    })
    return obj
  }
}

module.exports = new GeneralUtils()
