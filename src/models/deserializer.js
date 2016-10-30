const RuleFunction = require('./rule-function');

class Deserializer extends RuleFunction {

    /**
     * Match text using a regexp
     * @param {RegExp} re
     * @param {Function} callback
     * @return {Deserializer}
     */
    matchRegExp(re, callback) {
        return this.then((state, text, next) => {

        });
    }

}

module.exports = () => new Deserializer();
