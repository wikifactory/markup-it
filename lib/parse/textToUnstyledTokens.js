var Immutable = require('immutable');

var defaultRules = require('../constants/defaultRules');
var matchRule = require('./matchRule');


/**
 * Convert a normal text into a list of unstyled tokens (block or inline)
 *
 * @param {ParsingState} state
 * @param {Boolean} isInline
 * @param {String} text
 * @return {List<Token>}
 */
function textToUnstyledTokens(state, isInline, text) {
    if (!text) {
        return Immutable.List();
    }

    var rule = isInline? defaultRules.inlineRule : defaultRules.blockRule;

    return matchRule(state, rule, text);
}

module.exports = textToUnstyledTokens;
