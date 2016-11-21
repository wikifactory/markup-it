const { Serializer, BLOCKS } = require('../../');
const serializeBlock = require('./serializeBlock');

/**
 * Serialize a blockquote to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.BLOCKQUOTE)
    .then(serializeBlock('blockquote'));

module.exports = { serialize };
