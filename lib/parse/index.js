var Content = require('../models/content');
var lex = require('./lex');

function createContext(ctx) {
    return (ctx || {});
}

/*
    Parse an inline text into a list of tokens

    @param {Syntax} syntax
    @param {String} text
    @param {Object} ctx
    @return {List<Token>}
*/
function parseInline(syntax, text, ctx) {
    var inlineRulesSet = syntax.getInlineRulesSet();
    var inlineRules = inlineRulesSet.getRules();

    // Parse block tokens
    var tokens = lex(inlineRules, text, ctx);

    // Parse inline content for each token
    tokens = tokens.map(function(token) {
        var rule = inlineRulesSet.getRule(token.getType());
        if (!rule.getOption('parseInline', true)) {
            return token;
        }

        var inlineTokens = parseInline(syntax, token.getText(), ctx);

        token = token.set('tokens', inlineTokens);
        return token;
    });

    return tokens;
}

/*
    Parse a text using a syntax into a Content

    @param {Syntax} syntax
    @param {String} text
    @param {Object} ctx
    @return {Content}
*/
function parse(syntax, text, ctx) {
    var blockRulesSet = syntax.getBlockRulesSet();
    var blockRules = blockRulesSet.getRules();

    // Create a new context
    ctx = createContext(ctx);

    // Parse block tokens
    var tokens = lex(blockRules, text, ctx);

    // Parse inline content for each token
    tokens = tokens.map(function(token) {
        var rule = blockRulesSet.getRule(token.getType());
        if (!rule.getOption('parseInline', true)) {
            return token;
        }

        var inlineTokens = parseInline(syntax, token.getText(), ctx);

        token = token.set('tokens', inlineTokens);
        return token;
    });

    return Content.createFromTokens(tokens);
}

module.exports = parse;
module.exports.inline = parseInline;
