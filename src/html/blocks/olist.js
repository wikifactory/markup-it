const { Serializer, BLOCKS } = require('../../');
const serializeTag = require('../serializeTag');

/**
 * Serialize an ordered list to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.OL_LIST)
    .then(serializeTag('ol'));

module.exports = { serialize };
