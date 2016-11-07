const RuleFunction = require('./rule-function');

class Deserializer extends RuleFunction {

    /**
     * Match text using a regexp, and move the state to the right position.
     *
     * @param {RegExp} re
     * @param {Function} callback
     * @return {Deserializer}
     */
    matchRegExp(re, callback) {
        return this.filter(state => {
            return re.test(state.text);
        })
        .then(state => {
            const match = re.exec(state.text);
            state = state.skip(match[0].length);

            return callback(state, match);
        });
    }

}

module.exports = () => new Deserializer();
