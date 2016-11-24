const { Serializer, INLINES } = require('../../');

/**
 * Serialize an HTML inline to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.HTML)
    .then(state => {
        const node = state.peek();
        const html = node.data.get('html');

        return state.shift().write(html);
    });

module.exports = { serialize };
