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
     * Create the serializing function from the stack
     * @param  {Function} fn
     * @return {RuleFunction}
     */
    then(fn) {
        return this.compose((next) => {
            return (state, value) => {
                value = fn(state, value);
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
        return this.compose((next) => {
            return (state, value) => {
                if (!match(state, value)) {
                    return;
                }

                return next(state, value);
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
