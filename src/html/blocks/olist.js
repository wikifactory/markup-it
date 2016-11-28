const { Serializer, BLOCKS } = require('../../');

/**
 * Serialize an ordered list to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.OL_LIST)
    .then(state => {
        const node = state.peek();
        const inner = state.serialize(node.nodes);

        return state
            .shift()
            .write(`<ol>\n${inner}</ol>\n`);
    });

module.exports = { serialize };
