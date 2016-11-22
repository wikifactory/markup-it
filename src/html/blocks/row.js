const { Serializer, BLOCKS } = require('../../');
const serializeTag = require('../serializeTag');

/**
 * Serialize a row to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.TABLE_ROW)
    .then(serializeTag('tr'));

module.exports = { serialize };
