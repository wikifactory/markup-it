const { Serializer, BLOCKS } = require('../../');

/**
 * Serialize an HTML block to HTML (pretty easy, huh?)
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.HTML)
    .then(state => {
        const node = state.peek();

        return state
            .shift()
            .write(`${node.text}\n\n`);
    });

module.exports = { serialize };
