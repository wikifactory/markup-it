const { Serializer, BLOCKS } = require('../../');
const serializeBlock = require('./serializeBlock');

/**
 * Serialize a code block to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.CODE)
    .then(serializeBlock('pre', {
        getAttrs: (node) => {
            return { syntax: node.data.get('syntax') };
        }
    }));

module.exports = { serialize };
