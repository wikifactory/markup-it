const { Block } = require('../');

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
    return state
        .push(
            Block.create({
                nodes: [
                    state.text
                ],
                type: 'line'
            }))
        .skip(state.text.length);
}

module.exports = { serialize, deserialize };

