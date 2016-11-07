const { Serializer, Deserializer, Text } = require('../');
const reInline = require('./re/inline');
const utils = require('./utils');

/**
 * Serialize a text node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchKind('text')
    .then((state, range) => {
        return utils.escape(range.text, false);
    });

/**
 * Deserialize escaped text.
 * @type {Deserializer}
 */
const deserializeEscaped = Deserializer()
    .matchRegExp(reInline.escape, (state, match) => {
        const node = Text.createFromString(match[1], state.marks);
        return state.push(node);
    });

/**
 * Deserialize text.
 * @type {Deserializer}
 */
const deserializeText = Deserializer()
    .matchRegExp(reInline.text, (state, match) => {
        const text = utils.unescape(match[0]);
        const node = Text.createFromString(text, state.marks);
        return state.push(node);
    });

const deserialize = Deserializer()
    .use(deserializeEscaped)
    .use(deserializeText);

module.exports = { serialize, deserialize };
