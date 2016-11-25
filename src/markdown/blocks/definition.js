const { Map } = require('immutable');
const { Deserializer } = require('../../');
const reBlock = require('../re/block');

/**
 * Deserialize a definition.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
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

module.exports = { deserialize };
