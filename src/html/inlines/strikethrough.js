const { Serializer, MARKS } = require('../../');

/**
 * Serialize a strikethrough text to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformMarkedRange(MARKS.STRIKETHROUGH, (state, text, mark) => {
        return `<strike>${text}</strike>`;
    });

module.exports = { serialize };
