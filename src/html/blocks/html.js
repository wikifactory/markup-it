const { Serializer, Deserializer } = require('../../');
const parse = require('./parse');

/**
 * Default rule to serialize to HTML. Should be removed in the end.
 * @type {Serializer}
 */
const serialize = Serializer()
.then((state) => {
    // Match any node
    const node = state.peek();
    return state
        .shift()
        .write(node.text);
});

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

module.exports = { serialize, deserialize };

