var is = require('is');

var Immutable = require('immutable');
var Token = require('../models/token');

var BLOCKS = require('../constants/blocks');

/**
    Convert a normal text into a list of unstyled tokens (block or inline)

    @param {String} text
    @param {Boolean} inlineMode
    @return {List<Token>}
*/
function textToUnstyledTokens(text, inlineMode) {
    var lines = text.split('\n');

    return Immutable.List(lines)
        .map(function(line) {
            if (!line.trim()) {
                return null;
            }

            return inlineMode? Token.createInlineText(line) : Token.createBlockText(line);
        })
        .filter(function(tok) {
            return Boolean(tok);
        });
}


/**
    Process a text using a set of rules
    to return a flat list of tokens

    @param {Boolean} inlineMode
    @param {List<Rule>} rules
    @param {String} text
    @param {List<Token>} parents
    @param {Object} ctx
    @return {List<Token>}
*/
function lex(inlineMode, rules, text, parents, ctx, nonParsed) {
    var parsedTokens;
    var tokens = new Immutable.List();
    nonParsed = nonParsed || '';

    if (!text) {
        return tokens.concat(textToUnstyledTokens(nonParsed, inlineMode));
    }

    rules.forEach(function(rule) {
        var matches = rule.onText(ctx, text, parents);

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

        return lex(inlineMode, rules, text, parents, ctx, nonParsed);
    } else {
        tokens = tokens.concat(textToUnstyledTokens(nonParsed, inlineMode));

        parsedTokens.forEach(function(token) {
            // Push new token
            if (token.getType() != BLOCKS.IGNORE) tokens = tokens.push(token);

            // Update source text
            text = text.substring(token.getRaw().length);
        });

        // Keep parsing
        tokens = tokens.concat(
            lex(inlineMode, rules, text, parents, ctx)
        );
    }

    return tokens;
}

module.exports = {
    inline: lex.bind(null, true),
    block: lex.bind(null, false)
};
