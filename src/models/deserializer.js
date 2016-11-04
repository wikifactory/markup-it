const RuleFunction = require('./rule-function');

class Deserializer extends RuleFunction {

    /**
     * Match text using a regexp
     * @param {RegExp} re
     * @param {Function} callback
     * @return {Deserializer}
     */
    matchRegExp(re, callback) {
        return this.filter((state, text) => {
            return re.test(text);
        })
        .then((state, text) => {
            return callback(state, re.exec(text));
        });
    }

}

module.exports = () => new Deserializer();
