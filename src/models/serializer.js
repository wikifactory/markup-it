const typeOf = require('type-of');
const RuleFunction = require('./rule-function');

class Serializer extends RuleFunction {

    /**
     * Limit execution of the serializer to a set of node types
     * @param {Function || Array || String} matcher
     * @return {Serializer}
     */
    matchType(matcher) {
        matcher = normalizeMatcher(matcher);

        return this.filter(state => {
            const node = state.peek();
            const { type } = node;
            return matcher(type);
        });
    }

    /**
     * Limit execution of the serializer to a kind of node
     * @param {Function || Array || String} matcher
     * @return {Serializer}
     */
    matchKind(matcher) {
        matcher = normalizeMatcher(matcher);

        return this.filter(state => {
            const node = state.peek();
            const { kind } = node;
            return matcher(kind);
        });
    }

    /**
     * Limit execution of the serializer to range containing a certain mark
     * @param {Function || Array || String} matcher
     * @return {Serializer}
     */
    matchMark(matcher) {
        matcher = normalizeMatcher(matcher);

        return this
        .matchKind('range')
        .filter(state => {
            const range = state.doSomething();
            const { marks } = range;
            return marks.some(mark => matcher(mark.type));
        });
    }
}

/**
 * Normalize a node matching plugin option.
 *
 * @param {Function || Array || String} matchIn
 * @return {Function}
 */

function normalizeMatcher(matcher) {
    switch (typeOf(matcher)) {
    case 'function':
        return matcher;
    case 'array':
        return type => matcher.includes(type);
    case 'string':
        return type => type == matcher;
    }
}


module.exports = () => new Serializer();
