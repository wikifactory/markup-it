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
    .then((state, node) => {
        const inner = state.serialize(node.nodes);
        return state.write(`<p>${inner}</p>\n`);
    });


module.exports = { serialize };
