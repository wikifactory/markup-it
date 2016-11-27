const { Map } = require('immutable');
const { Serializer, Deserializer, Inline, Text, INLINES } = require('../../');
const reInline = require('../re/inline');

/**
 * Resolve a reference in a state.
 * @param  {State} state
 * @param  {String} refID
 * @return {Object} props?
 */
function resolveRef(state, refID) {
    const refs = state.getProp('refs');

    refID = refID
        .replace(/\s+/g, ' ')
        .toLowerCase();

    return refs.get(refID);
}

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

/**
 * Deserialize an url:
 *  https://www.google.fr
 * @type {Deserializer}
 */
const deserializeUrl = Deserializer()
    .matchRegExp(reInline.url, (state, match) => {
        // Already inside a link?
        if (state.getProp('link')) {
            return;
        }

        const href = match[1];

        const node = Inline.create({
            type: INLINES.LINK,
            nodes: [
                Text.createFromString(href)
            ],
            data: { href }
        });

        return state.push(node);
    });

/**
 * Deserialize a reference link:
 *  https://www.google.fr
 * @type {Deserializer}
 */
const deserializeRef = Deserializer()
    .matchRegExp(reInline.reflink, (state, match) => {
        // Already inside a link?
        if (state.getProp('link')) {
            return;
        }

        const refID = (match[2] || match[1]);
        const inner = match[1];
        const data = resolveRef(state, refID);

        if (!data) {
            return state.push(
                Text.createFromString(match[0])
            );
        }

        const nodes = state.use('inline')
            .setProp('link', state.depth)
            .deserialize(inner);

        const node = Inline.create({
            type: INLINES.LINK,
            nodes,
            data
        });

        return state.push(node);
    });

const deserialize = Deserializer()
    .use([
        deserializeNormal,
        deserializeUrl,
        deserializeRef
    ]);

module.exports = { serialize, deserialize };
