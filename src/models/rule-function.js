const { Record, List } = require('immutable');

const DEFAULTS = {
    stack: List()
};

class RuleFunction extends Record(DEFAULTS) {

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
     * Push a filter to the stack.
     * @param {Function} match
     * @return {Serializer}
     */
    filter(match) {
        return this.then((state, arg, next) => {
            if (!match(state, arg)) {
                return;
            }

            return next(state, arg);
        });
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

module.exports = RuleFunction;
