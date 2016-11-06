const RuleFunction = require('./rule-function');

class Deserializer extends RuleFunction {

    /**
     * Match text using a regexp
     * @param {RegExp} re
     * @return {Deserializer}
     */
    matchRegExp(re) {
        return this.filter((state, text) => {
            return re.test(text);
        })
        .then((state, text) => {
            return re.exec(text);
        });
    }

}

module.exports = () => new Deserializer();
