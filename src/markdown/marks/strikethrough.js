const { Serializer, Deserializer, Mark, MARKS } = require('../../');
const reInline = require('../re/inline');

/**
 * Serialize a strikethrough text to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchMark(MARKS.STRIKETHROUGH)
    .then((state, range) => {
        const { text } = range;
        return `~~${text}~~`;
    });

/**
 * Deserialize a strikethrough.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reInline.del, (state, match) => {
        const text = match[1];
        const mark = Mark.create({ type: MARKS.STRIKETHROUGH });

        return state.deserialize(text, {
            marks: state.marks.push(mark)
        });
    });

module.exports = { serialize, deserialize };
