const parse = require('./parse');

/**
 * Default rule to serialize to HTML. Should be removed in the end.
 * @type {Serializer}
 */
function serialize(state) {
    // Match any node
    return state.unshift().state.write(state.nodes.first().text + '\n');
}

/**
 * Deserialize an HTML string
 * @type {Deserializer}
 */
function deserialize(state) {
    const nodes = parse(state.text);

    return nodes.reduce((state, node) => {
        return state.push(node);
    })
    .skip(state.text.length);
}

module.exports = { serialize, deserialize };

