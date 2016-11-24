const { Serializer, BLOCKS } = require('../../');

/**
 * Serialize a list item to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.LIST_ITEM)
    .then(state => {
        const node = state.peek();
        const inner = state.serialize(node.nodes);

        return state
            .shift()
            .write(`<li>${inner}</li>\n`);
    });

module.exports = { serialize };
