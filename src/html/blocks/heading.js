const { Serializer, BLOCKS } = require('../../');
const serializeBlock = require('./serializeBlock');

const RULES = {
    [BLOCKS.HEADING_1]: serializeBlock('h1', { getAttrs }),
    [BLOCKS.HEADING_2]: serializeBlock('h2', { getAttrs }),
    [BLOCKS.HEADING_3]: serializeBlock('h3', { getAttrs }),
    [BLOCKS.HEADING_4]: serializeBlock('h4', { getAttrs }),
    [BLOCKS.HEADING_5]: serializeBlock('h5', { getAttrs }),
    [BLOCKS.HEADING_6]: serializeBlock('h6', { getAttrs })
};

/**
 * Serialize a heading to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(Object.keys(RULES))
    .then(state => {
        const node = state.peek();
        return RULES[node.type](state);
    });

/**
 * @param {Node} headingNode
 * @return {Object} The attributes names/value for the heading
 */
function getAttrs(headingNode) {
    return {
        id: headingNode.data.get('id')
    };
}

module.exports = { serialize };
