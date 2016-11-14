const {
    Serializer,
    BLOCKS
} = require('../../');

/**
 * Serialize a paragraph to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.PARAGRAPH)
    .then((state) => {
        const node = state.peek();
        const inner = state.serialize(node.nodes);
        return state
            .shift()
            .write(`<p>${inner}</p>\n`);
    });


module.exports = { serialize };
