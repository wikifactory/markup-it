const { Serializer, BLOCKS } = require('../../');
const serializeTag = require('../serializeTag');

/**
 * Serialize a unordered list to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.UL_LIST)
    .then(serializeTag('ul'));

module.exports = { serialize };
