const { Serializer, INLINES } = require('../../');

/**
 * Serialize an HTML inline to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.HTML)
    .then(state => {
        const node = state.peek();
        return node.shift().write(node.text);
    });

module.exports = { serialize };
