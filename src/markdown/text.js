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
 * Deserialize text.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reInline.escape, (state, match) => {
        return Text.createFromString(match[1], state.marks);
    })
    .matchRegExp(reInline.text, (state, match) => {
        const text = utils.unescape(match[0]);
        return Text.createFromString(text, state.marks);
    });

module.exports = { serialize, deserialize };
