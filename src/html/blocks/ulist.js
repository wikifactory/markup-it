const { Serializer, BLOCKS } = require('../../');

/**
 * Serialize a unordered list to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.UL_LIST)
    .then(state => {
        const node = state.peek();
        const inner = state.serialize(node.nodes);

        return state
            .shift()
            .write(`<ul>\n${inner}</ul>\n`);
    });

module.exports = { serialize };
