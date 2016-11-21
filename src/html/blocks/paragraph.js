const {
    Serializer,
    BLOCKS
} = require('../../');

const serializeBlock = require('./serializeBlock');

/**
 * Serialize a paragraph to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.PARAGRAPH)
    .then(serializeBlock('p'));

module.exports = { serialize };
