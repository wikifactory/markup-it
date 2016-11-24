const { Serializer, BLOCKS } = require('../../');
const serializeTag = require('../serializeTag');

/**
 * Serialize a table to HTML
 * @type {Serializer}
 */
const table = {
    serialize: Serializer()
        .matchType(BLOCKS.TABLE)
        .then(serializeTag('table'))
};

/**
 * Serialize a row to HTML
 * @type {Serializer}
 */
const row = {
    serialize: Serializer()
        .matchType(BLOCKS.TABLE_ROW)
        .then(serializeTag('tr'))
};

/**
 * Serialize a table cell to HTML
 * @type {Serializer}
 */
const cell = {
    serialize: Serializer()
        .matchType(BLOCKS.TABLE_CELL)
        .then(serializeTag('td'))
};

module.exports = {
    table,
    row,
    cell
};
