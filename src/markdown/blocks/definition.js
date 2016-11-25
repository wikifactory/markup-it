const { Map } = require('immutable');
const { Deserializer, State } = require('../../');
const reBlock = require('../re/block');

/**
 * Deserialize a definition.
 * @type {Deserializer}
 */
const deserializeOnlyDef = Deserializer()
    .matchRegExp(reBlock.def, (state, match) => {
        if (state.depth > 1) {
            return;
        }

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
        const { text, depth, nodes } = state;

        // Apply it as first rule only
        if (depth > 0 || nodes.size > 0) {
            return;
        }

        console.log('parse definitions');

        const parser = State({
            blocks: [ { deserialize: deserializeOnlyDef } ]
        });
    });

module.exports = { deserialize };
