const { Deserializer } = require('../../');
const parse = require('./parse');

/**
 * Deserialize an HTML string
 * @type {Deserializer}
 */
const deserialize = Deserializer()
.then((state) => {
    const nodes = parse(state.text);
    return state
        .push(nodes)
        .skip(state.text.length);
});

module.exports = { deserialize };

