var Immutable = require('immutable');
var Token = require('../models/token');

/*
    Process a text using a set of rules

    @param {List<Rule>} rules
    @param {String} text
    @param {Object} ctx
    @return {List<Token>}
*/
function lex(rules, text, ctx) {
    var token;
    var tokens = new Immutable.List();

    rules.forEach(function(rule) {
        var match = rule.onText(ctx, text);
        if (!match) return;

        token = new Token({
            type: match.type,
            text: match.text,
            raw: match.raw,
            data: match.data
        });

        return false;
    });

    // push new token
    tokens = tokens.push(token);

    // Update source text
    text = text.substring(token.getRaw().length);

    // Keep parsing
    if (text) {
        tokens = tokens.concat(
            lex(rules, text, ctx)
        );
    }

    return tokens;
}

module.exports = lex;
