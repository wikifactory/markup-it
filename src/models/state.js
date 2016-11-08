const { Record, List, Stack, Map } = require('immutable');
const { Document, Text, Block } = require('slate');
const BLOCKS = require('../constants/blocks');

/*
    State stores the global state when serializing a document or deseriaizing a text.
 */

function createTextBlock(text) {
    text = Text.createFromString(text);
    return Block.create({
        type: BLOCKS.TEXT,
        nodes: [text]
    });
}

const DEFAULTS = {
    text:        '',
    nodes:       Stack(),
    activeRules: String('blocks'),
    rulesSet:    Map(),
    depth:       0
};

class State extends Record(DEFAULTS) {

    /**
     * Create a new state from a set of rules.
     * @param  {Array} rules
     * @return {State} state
     */
    static create(rulesSet = {}) {
        return new State({
            rulesSet: Map(rulesSet).map(List)
        });
    }

    /**
     * Return list of rules currently being used
     * @return {List} rules
     */
    get rules() {
        const { activeRules, rulesSet } = this;
        return activeRules.get(rulesSet);
    }

    /**
     * Return kind of nodes currently being parsed
     * @return {String} kind
     */
    get kind() {
        const { nodes } = this;
        if (nodes.size == 0) {
            return 'block';
        }

        const hasBlock = nodes.some(node => node.kind == 'block');
        return hasBlock ? 'block' : 'inline';
    }

    /**
     * Change set of rules to use.
     *
     * @param  {String} activeRules
     * @return {State} state
     */
    use(id) {
        return this.merge({ activeRules });
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
     * Parse current text buffer
     * @return {State} state
     */
    lex(rest = '') {
        const state = this;
        let newState;
        const { text, rules } = state;

        if (!text) {
            if (rest) {
                const node = this.kind == 'block' ? createTextBlock(rest) : Text.createFromString(rest);
                return this.push(node);
            }

            return this;
        }

        rules.forEach(rule => {
            newState = rule.deserialize.exec(state);
            if (newState) {
                return false;
            }
        });

        if (newState && rest) {
            const node = newState.kind == 'block' ? createTextBlock(rest) : Text.createFromString(rest);
            newState = newState.merge({
                nodes: newState.nodes.insert(state.nodes.size, node)
            });
        } else if (!newState) {
            rest += text[0];
            newState = state.skip(1);
        }

        return newState.lex(rest);
    }

    /**
     * Deserialize a text into a Node.
     * @param  {String} text
     * @return {List<Node>} nodes
     */
    deserialize(text) {
        const state = this
            .down()
            .merge({ text, nodes: List() })
            .lex();

        return state.nodes;
    }

    /**
     * Deserialize a text into a Document
     * @param  {String} text
     * @return {Document} document
     */
    deserializeToDocument(text) {
        const nodes = this.deserialize(text);
        return Document.create({ nodes });
    }

    /**
     * Serialize nodes into text
     * @param  {List<Node>} nodes
     * @return {String} text
     */
    serialize(nodes) {
        let state = this
            .down()
            .merge({ text: '', nodes });
    }
}

module.exports = State;
