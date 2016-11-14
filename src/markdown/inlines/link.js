const { Map } = require('immutable');
const { Serializer, Deserializer, Inline, INLINES } = require('../../');
const reInline = require('../re/inline');

/**
 * Serialize a link to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.LINK)
    .then((state) => {
        const node = state.peek();
        const { data, nodes } = node;
        const inner = state.use('inline').serialize(nodes);
        const href   = data.get('href', '');
        let title = data.get('title', '');

        if (title) {
            title = title ? ` "${title}"` : '';
        }

        const output = `[${inner}](${href}${title})`;

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
        const inner = match[1];
        const nodes = state.use('inline')
            // Signal to children that we are in a link
            .setProp('link', state.depth)
            .deserialize(inner);

        const data = Map({
            href: match[2],
            title: match[3]
        }).filter(Boolean);

        const node = Inline.create({
            type: INLINES.LINK,
            nodes,
            data
        });

        return state.push(node);
    });

const deserialize = Deserializer()
    .use([
        deserializeNormal
    ]);

module.exports = { serialize, deserialize };
