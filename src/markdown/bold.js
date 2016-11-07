const { Serializer, Deserializer, Mark, MARKS } = require('../');
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
        const text = match[2] || match[1];
        const mark = Mark.create({ type: MARKS.BOLD });

        return state.deserialize(text, {
            marks: state.marks.push(mark)
        });
    });

module.exports = { serialize, deserialize };
