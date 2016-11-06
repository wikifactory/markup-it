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
    .matchRegExp(reInline.escape)
    .then((state, match) => {
        return Text.createFromString(match[1], state.marks);
    });

/**
 * Deserialize text.
 * @type {Deserializer}
 */
const deserializeText = Deserializer()
    .matchRegExp(reInline.text)
    .then((state, match) => {
        const text = utils.unescape(match[0]);
        return Text.createFromString(text, state.marks);
    });

const deserialize = Deserializer()
    .use(deserializeEscaped)
    .use(deserializeText);

module.exports = { serialize, deserialize };
