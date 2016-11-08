const { Serializer, Deserializer, Mark, MARKS } = require('../../');
const reInline = require('../re/inline');

/**
 * Serialize a italic text to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchMark(MARKS.ITALIC)
    .then((state, range) => {
        return `_${range.text}_`;
    });

/**
 * Deserialize an italic.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reInline.strong, (state, match) => {
        const text = match[2] || match[1];
        const mark = Mark.create({ type: MARKS.ITALIC });

        return state.deserialize(text, {
            marks: state.marks.push(mark)
        });
    });

module.exports = { serialize, deserialize };
