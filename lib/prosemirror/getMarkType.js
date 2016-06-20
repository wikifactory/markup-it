var markTypes = require('./markTypes');

/**
 * Get mark type for a token
 * @param  {String} type
 * @return {String}
 */
module.exports = function getMarkType(type) {
    return markTypes.get(type);
};
