const { Serializer } = require('../../');

/**
 * Serialize a text node to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchKind('text')
    .then(state => {
        const node = state.peek();
        return state
            .shift()
            .write(node.text);
    });

module.exports = { serialize };
