const { Serializer, BLOCKS } = require('../../');
const serializeBlock = require('./serializeBlock');

/**
 * Serialize an horizontal rule to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.HR)
    .then(serializeBlock('hr', {
        isSingleTag: true
    }));

module.exports = { serialize };
