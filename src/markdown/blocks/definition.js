const { Map } = require('immutable');
const { Document, Raw } = require('slate');
const { Deserializer, State } = require('../../');
const reBlock = require('../re/block');

/**
 * Cleanup a text before parsing: normalize newlines and tabs
 *
 * @param {String} src
 * @return {String}
 */
function cleanupText(src) {
    return src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n')
    .replace(/^ +$/gm, '');
}

/**
 * Deserialize a definition.
 * @type {Deserializer}
 */
const deserializeOnlyDef = Deserializer()
    .matchRegExp(reBlock.def, (state, match) => {
        const id    = match[1].toLowerCase();
        const href  = match[2];
        const title = match[3];

        let refs = state.getProp('refs') || Map();

        refs = refs.set(id, {
            href, title
        });

        // No node is pushed when parsing definition
        return state.setProp('refs', refs);
    });

/**
 * Deserialize all definitions in a markdown document and store them as
 * "refs" prop.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .then(state => {
        let { text, depth, nodes } = state;

        // Apply it as first rule only
        if (depth > 1 || nodes.size > 0 || state.getProp('refs')) {
            return;
        }

        const parser = State.create({
            block: [ { deserialize: deserializeOnlyDef } ]
        });

        // Normalize the text
        text = cleanupText(text);

        // Parse all definitions
        const parsed = parser
            .down()
            .write(text)
            .lex('', { trim: false });

        // Get content without definitions
        const doc = Document.create({ nodes: parsed.nodes });
        console.log(JSON.stringify(Raw.serializeDocument(doc), null, 4));
        text = doc.text;

        console.log(text);

        return state
            .replaceText(text)
            .setProp('refs',
                parsed.getProp('refs') || Map()
            );
    });

module.exports = { deserialize };
