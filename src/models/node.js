const { Record, Map, List } = require('immutable');

const DEFAULTS = {
    type:  String(),
    data:  Map(),
    nodes: List()
};

class Node extends Record(DEFAULTS) {

    /**
     * Create a new node from a set of properties.
     * @param  {Object | Map | Node} properties
     * @return {Node} node
     */
    create(properties = {}) {
        if (properties instanceof Node) return node;
        return new Node({
            type:  properties.type,
            data:  Map(properties.data),
            nodes: List(properties.nodes)
        });
    }

    /**
     * Get the node's kind.
     *
     * @return {String} kind
     */

    get kind() {
      return 'block'
    }

}

module.exports = Node;
