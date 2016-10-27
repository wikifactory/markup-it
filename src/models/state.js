
class State {

    /**
     * Create a new state from a set of rules.
     * @param  {Array} rules
     * @return {State} state
     */
    create(rules = []) {
        const state = new State();
        state.rules = rules;

        return state;
    }

    /**
     * Deserialize a text into a Node.
     * @param  {String} text
     * @return {Node} node
     */
    deserialize(text) {

    }

    /**
     * Serialize a node to text
     * @param  {Node} node
     * @return {String} text
     */
    serialize(node) {

    }
}

module.exports = State;
