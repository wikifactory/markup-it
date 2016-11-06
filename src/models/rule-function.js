const { Record } = require('immutable');

const DEFAULTS = {
    transform: (state, value) => value
};

class RuleFunction extends Record(DEFAULTS) {

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
            return (state, value) => {
                value = transform(state, value);
                if (typeof value == 'undefined') {
                    return;
                }

                return next(state, value);
            };
        });
    }

    /**
     * Push an alternative to the stack
     * @param  {Function} next
     * @return {RuleFunction}
     */
    use(fn) {
        fn = fn instanceof RuleFunction ? fn.exec : fn;
        return this.compose((next) => {
            return (state, value) => {
                const newValue = fn(state, value);

                // We exit if
                if (typeof newValue != 'undefined') {
                    return newValue;
                }

                return next(state, value);
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
            return (state, value) => {
                if (!match(state, value)) {
                    return;
                }

                return transform(state, value);
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
        return this.transform(state, value);
    }

}

module.exports = RuleFunction;
