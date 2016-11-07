const { Record, List, Stack } = require('immutable');
const { Document } = require('slate');

/*
    State stores the global state when serializing a document or deseriaizing a text.
 */

const DEFAULTS = {
    text:  '',
    nodes: Stack(),
    rules: List(),
    depth: 0
};

class State extends Record(DEFAULTS) {

    /**
     * Create a new state from a set of rules.
     * @param  {Array} rules
     * @return {State} state
     */
    static create(rules = []) {
        return new State({
            rules: List(rules)
        });
    }

    /**
     * Write a string. This method can be used when serializing nodes into text.
     *
     * @param  {String} string
     * @return {State} state
     */
    write(string) {
        let { text } = this;
        text += string;
        return this.merge({ text });
    }

    /**
     * Peek the first node in the stack
     *
     * @return {Node} node
     */
    peek() {
        return this.nodes.peek();
    }

    /**
     * Unshift the first node from the stack
     *
     * @return {State} state
     */
    unshift() {
        let { nodes } = this;
        nodes = nodes.unshift();
        return this.merge({ nodes });
    }

    /**
     * Move this state to a upper level
     *
     * @param  {Number} string
     * @return {State} state
     */
    up() {
        let { depth } = this;
        depth--;
        return this.merge({ depth });
    }

    /**
     * Move this state to a lower level
     *
     * @param  {Number} string
     * @return {State} state
     */
    down() {
        let { depth } = this;
        depth++;
        return this.merge({ depth });
    }

    /**
     * Push a new node to the stack. This method can be used when deserializing
     * a text into a set of nodes.
     *
     * @param  {Node} node
     * @return {State} state
     */
    push(node) {
        let { nodes } = this;
        nodes = nodes.push(node);
        return this.merge({ nodes });
    }

    /**
     * Skip "n" characters in the text.
     * @param  {Number} n
     * @return {State} state
     */
    skip(n) {
        let { text } = this;
        text = text.slice(n);
        return this.merge({ text });
    }

    /**
     * Deserialize a text into a Node.
     * @param  {String} text
     * @return {List<Node>} nodes
     */
    deserialize(text) {
        let state = this
            .down()
            .merge({ text });
        // todo

        return state.nodes;
    }

    /**
     * Deserialize a text into a Document
     * @param  {String} text
     * @return {Document} document
     */
    deserializeToDocument(text) {
        const nodes = this.deserialize(text);
        return new Document({ nodes });
    }
}

module.exports = State;
