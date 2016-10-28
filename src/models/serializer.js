const typeOf = require('type-of');
const { Record, List } = require('immutable');

const DEFAULTS = {
    stacks: List()
};

class Serializer extends Record(DEFAULTS) {

    /**
     * Limit execution of the serializer to a set of node types
     * @param {Function || Array || String} matcher
     * @return {Serializer}
     */
    matchType(matcher) {
        matcher = normalizeMatcher(matcher);

        return this.then((state, node, next) => {
            const { type } = node;
            if (!matcher(type)) {
                return;
            }

            return next(state, node);
        });
    }

    /**
     * Create the serializing function from the stack
     * @param  {Function} fn
     * @return {Serializer}
     */
    then(fn) {
        let { stack } = this;
        stack = stack.push(fn);
        return this.merge({ stack });
    }

    /**
     * Apply
     */
    apply(state, value) {
        const { stack } = this;

        return stack.reduce(
            (v, fn) => {
                
            },
            value
        );
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
