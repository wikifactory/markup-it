const { Serializer } = require('../../');

/**
 * Default rule to serialize to HTML. Should be removed in the end.
 * @type {Serializer}
 */
const serialize = Serializer()
.then((state) => {
    // Match any node
    const node = state.peek();
    console.log('Skipping unknown node', node.toJS());
    return state.shift();
});

module.exports = { serialize };
