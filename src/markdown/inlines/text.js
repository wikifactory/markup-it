const { Serializer, Deserializer } = require('../../');
const reInline = require('../re/inline');
const utils = require('../utils');

/**
 * Serialize a text node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchKind('text')
    .then(state => {
        const text = state.use('marks').serializeNode(text);

        return state
            .shift()
            .write(text);
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
    .use(deserializeEscaped)
    .use(deserializeText);

module.exports = { serialize, deserialize };
