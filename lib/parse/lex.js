var Immutable = require('immutable');
var Token = require('../models/token');

/*
    Process a text using a set of rules
    to return a flat list of tokens

    @param {List<Rule>} rules
    @param {String} text
    @param {Object} ctx
    @return {List<Token>}
*/
function lex(rules, text, ctx, nonParsed) {
    var token;
    var tokens = new Immutable.List();

    if (!text) {
        if (nonParsed) {
            tokens = tokens.push(
                Token.createText(nonParsed)
            );
        }

        return tokens;
    }

    nonParsed = nonParsed || '';

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

    // Nothing match this text, we move to the next character and try again
    // When found, we add a new token "unstyled"
    if (!token) {
        nonParsed += text[0];
        text = text.substring(1);

        return lex(rules, text, ctx, nonParsed);
    } else {
        if (nonParsed) {
            tokens = tokens.push(
                Token.createText(nonParsed)
            );
        }

        // Push new token
        tokens = tokens.push(token);

        // Update source text
        text = text.substring(token.getRaw().length);

        // Keep parsing
        tokens = tokens.concat(
            lex(rules, text, ctx)
        );
    }

    return tokens;
}

module.exports = lex;
