var is = require('is');

var Immutable = require('immutable');
var Token = require('../models/token');

var BLOCKS = require('../constants/blocks');

/*
    Process a text using a set of rules
    to return a flat list of tokens

    @param {Boolean} inlineMode
    @param {List<Rule>} rules
    @param {String} text
    @param {Token|null} parent
    @param {Object} ctx
    @return {List<Token>}
*/
function lex(inlineMode, rules, text, parent, ctx, nonParsed) {
    var parsedTokens;
    var tokens = new Immutable.List();

    if (!text) {
        if (nonParsed) {
            tokens = tokens.push(
                inlineMode? Token.createInlineText(nonParsed) : Token.createBlockText(nonParsed)
            );
        }

        return tokens;
    }

    nonParsed = nonParsed || '';

    rules.forEach(function(rule) {
        var matches = rule.onText(ctx, text, parent);

        if (!matches || matches.length === 0) return;
        if (!is.array(matches)) {
            matches = [matches];
        }

        parsedTokens = Immutable.List(matches)
            .map(function(match) {
                return Token.create(match.type, match);
            });

        return false;
    });

    // Nothing match this text, we move to the next character and try again
    // When found, we add a new token "unstyled"
    if (!parsedTokens) {
        nonParsed += text[0];
        text = text.substring(1);

        return lex(inlineMode, rules, text, parent, ctx, nonParsed);
    } else {
        if (nonParsed) {
            tokens = tokens.push(
                inlineMode? Token.createInlineText(nonParsed) : Token.createBlockText(nonParsed)
            );
        }

        parsedTokens.forEach(function(token) {
            // Push new token
            if (token.getType() != BLOCKS.IGNORE) tokens = tokens.push(token);

            // Update source text
            text = text.substring(token.getRaw().length);
        });

        // Keep parsing
        tokens = tokens.concat(
            lex(inlineMode, rules, text, parent, ctx)
        );
    }

    return tokens;
}

module.exports = {
    inline: lex.bind(null, true),
    block: lex.bind(null, false)
};
