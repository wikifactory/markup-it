const { Serializer, BLOCKS } = require('../../');
const serializeTag = require('../serializeTag');

/**
 * Serialize a table to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.TABLE)
    .then(serializeTag('table'));

module.exports = { serialize };
