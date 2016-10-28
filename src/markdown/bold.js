const { Serializer, Deserializer, MARKS } = require('../');
const reInline = require('./re/inline');

/**
 * Serialize a bold text to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchMark(MARKS.BOLD)
    .then((state, range) => {
        return `**${range.text}**`;
    });

/**
 * Deserialize a bold.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reInline.strong, (state, match) => {

    });

module.exports = { serialize, deserialize };
