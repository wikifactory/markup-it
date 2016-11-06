const { Serializer, Deserializer, Mark, MARKS } = require('../');
const reInline = require('./re/inline');

/**
 * Serialize a code text to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchMark(MARKS.CODE)
    .then((state, range) => {
        let separator = '`';
        const { text } = range;

        // We need to find the right separator not present in the content
        while (text.indexOf(separator) >= 0) {
            separator += '`';
        }

        return (separator + text + separator);
    });

/**
 * Deserialize a code.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reInline.code)
    .then((state, match) => {
        const text = match[2];
        const mark = Mark.create({ type: MARKS.CODE });

        return state.deserialize(text, {
            marks: state.marks.push(mark)
        });
    });

module.exports = { serialize, deserialize };
