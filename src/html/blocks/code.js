const { Serializer, BLOCKS } = require('../../');
const serializeTag = require('../serializeTag');

/**
 * Serialize a code block to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.CODE)
    .then(serializeTag('pre', {
        getAttrs: (node) => {
            return { syntax: node.data.get('syntax') };
        }
    }));

module.exports = { serialize };
