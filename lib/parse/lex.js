var is = require('is');

/**
 * Process a text using a set of rules
 * to return a flat list of tokens
 *
 * @param {ParsingState} state
 * @param {List<Rule>} rules
 * @param {String} text
 * @return {List<Token>}
 */
function lex(state, rules, text) {
    var tokens;

    rules.forEach(function(rule) {
        tokens = rule.onText(state, text);

        if (!tokens) {
            return;
        }
        if (!is.array(tokens)) {
            tokens = [tokens];
        }

        return false;
    });


    if (!tokens) {
        throw new Error('No rules match text');
    }

    var newText = tokens.map(function(result, token) {
        return result.substring(token.getRaw().length);
    });

    // Keep parsing
    tokens = tokens.concat(
        lex(state, rules, newText)
    );

    return tokens;
}

module.exports = lex;
