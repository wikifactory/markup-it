const { Serializer, INLINES } = require('../../');
const serializeTag = require('../serializeTag');

/**
 * Serialize a link to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.LINK)
    .then(serializeTag('a', {
        getAttrs: (node) => {
            return {
                href: node.data.get('href')
            };
        }
    }));

module.exports = { serialize };
