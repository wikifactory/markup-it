const { Record, List } = require('immutable');

const DEFAULTS = {
    rules: List(),
    marks: List(),
    depth: 0
};

class State extends Record(DEFAULTS) {

    /**
     * Create a new state from a set of rules.
     * @param  {Array} rules
     * @return {State} state
     */
    create(rules = []) {
        return new State({
            rules: List(rules)
        });
    }

    /**
     * Push an active mark
     * @param {Mark} mark
     * @return {State} state
     */
    pushMark(mark) {
        let { marks } = this;
        marks = marks.push(mark);

        return this.merge({ marks });
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
        const { rules } = this;
        let result;

        rules.forEach(rule => {
            if (!rule.serialize) {
                return;
            }

            result = rule.serialize(this, node);

            if (result) {
                return false;
            }
        });

        return result;
    }
}

module.exports = State;
