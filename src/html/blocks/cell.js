const { Serializer, BLOCKS } = require('../../');
const serializeTag = require('../serializeTag');

/**
 * Serialize a table cell to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.TABLE_CELL)
    .then(serializeTag('td'));

module.exports = { serialize };
