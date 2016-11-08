const { Record } = require('immutable');

const DEFAULTS = {
    transform: state => state
};

class RuleFunction extends Record(DEFAULTS) {

    /**
     * Execute a rule function or a function.
     * @param {Funciton or RuleFunction} fn
     * @param {Mixed} ...args
     * @return {Mixed} result
     */
    static exec(fn, ...args) {
        return (fn instanceof RuleFunction) ? fn.exec(...args) : fn(...args);
    }

    /**
     * Add a composition to the transform function
     * @param  {Function} composer
     * @return {RuleFunction}
     */
    compose(composer) {
        let { transform } = this;

        transform = composer(transform);
        return this.merge({ transform });
    }

    /**
     * Push a transformation to the stack of execution.
     * @param  {Function} next
     * @return {RuleFunction}
     */
    then(next) {
        return this.compose((transform) => {
            return (state) => {
                state = transform(state);
                if (typeof state == 'undefined') {
                    return;
                }

                return next(state);
            };
        });
    }

    /**
     * Push an alternative to the stack
     * @param  {Function} next
     * @return {RuleFunction}
     */
    use(fn) {
        return this.compose((next) => {
            return (state) => {
                const newValue = RuleFunction.exec(fn, state);

                // We exit if
                if (typeof newValue != 'undefined') {
                    return newValue;
                }

                return next(state);
            };
        });
    }

    /**
     * Prevent applying the transform function if <match> is false
     * @param  {Function} match
     * @return {RuleFunction}
     */
    filter(match) {
        return this.compose((transform) => {
            return (state) => {
                if (!match(state)) {
                    return;
                }

                return transform(state);
            };
        });
    }

    /**
     * Execute the transform function on an input
     * @param  {State} state
     * @param  {Object} value
     * @return {Object}
     */
    exec(state, value) {
        return this.transform(state);
    }

}

module.exports = RuleFunction;
