const { Map } = require('immutable');
const { Serializer, Deserializer, Inline, INLINES } = require('../../');
const reInline = require('../re/inline');

/**
 * Test if a link input is an image
 * @param {String} raw
 * @return {Boolean}
 */
function isImage(raw) {
    return raw.charAt(0) === '!';
}

/**
 * Serialize a image to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.IMAGE)
    .then((state) => {
        const node = state.peek();
        const { data } = node;
        const alt   = data.get('alt', '');
        const src   = data.get('src', '');
        const title = data.get('title', '');

        let output;

        if (title) {
            output = `![${alt}](${src} "${title}")`;
        } else {
            output = `![${alt}](${src})`;
        }

        return state
            .shift()
            .write(output);
    });

/**
 * Deserialize a classic image like:
 *  ![Hello](test.png)
 * @type {Deserializer}
 */
const deserializeNormal = Deserializer()
    .matchRegExp(reInline.link, (state, match) => {
        if (!isImage(match[0])) {
            return;
        }

        const data = Map({
            alt: match[1],
            src: match[2],
            title: match[3]
        }).filter(Boolean);

        const node = Inline.create({
            type: INLINES.IMAGE,
            isVoid: true,
            data
        });

        return state.push(node);
    });

const deserialize = Deserializer()
    .use([
        deserializeNormal
    ]);

module.exports = { serialize, deserialize };
