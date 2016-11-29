const { Serializer, Deserializer } = require('../../');
const reInline = require('../re/inline');
const utils = require('../utils');

/**
 * Serialize a text node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchKind('text')

    // Escape all text
    .transformRanges(range => {
        let { text } = range;
        text = utils.escape(text, false);
        return range.merge({ text });
    })

    // Then process marks
    .then(state => {
        const node = state.peek();

        return state
            .shift()
            .write(node.text);
    });

/**
 * Deserialize escaped text.
 * @type {Deserializer}
 */
const deserializeEscaped = Deserializer()
    .matchRegExp(reInline.escape, (state, match) => {
        return state.pushText(match[1]);
    });

/**
 * Deserialize text.
 * @type {Deserializer}
 */
const deserializeText = Deserializer()
    .matchRegExp(reInline.text, (state, match) => {
        const text = utils.unescape(match[0]);
        return state.pushText(text);
    });

const deserialize = Deserializer()
    .use([
        deserializeEscaped,
        deserializeText
    ]);

module.exports = { serialize, deserialize };
