const parse = require('./parse');

/**
 * Serialize to HTML
 * @type {Serializer}
 */
function serialize(state) {
    return state.nodes.reduce((state, node) => {
        return state.unshift().state.write(node.text);
    });
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

