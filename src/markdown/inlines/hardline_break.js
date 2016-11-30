const { Serializer, Deserializer } = require('../../');
const reInline = require('../re/inline');

/**
 * Replace hardline break by two spaces followed by a newline
 *
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformText((state, range) => {
        const { text } = range;

        return range.merge({
            text: text.replace(/\n/g, '  \n')
        });
    });

/**
 * Deserialize hardline break.
 * http://spec.commonmark.org/0.26/#hard-line-break
 *
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reInline.br, (state, match) => {
        return state.pushText('\n');
    });

module.exports = { serialize, deserialize };
