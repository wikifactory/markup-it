const { Serializer, MARKS } = require('../../');

/**
 * Serialize an inline code to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformMarkedRange(MARKS.CODE, (state, text, mark) => {
        return `<pre>${text}</pre>`;
    });

module.exports = { serialize };
