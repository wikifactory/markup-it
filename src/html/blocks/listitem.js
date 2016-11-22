const { Serializer, BLOCKS } = require('../../');
const serializeTag = require('../serializeTag');

/**
 * Serialize a list item to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.LIST_ITEM)
    .then(serializeTag('li'));

module.exports = { serialize };
