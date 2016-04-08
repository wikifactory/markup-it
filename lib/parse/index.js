var Content = require('../models/content');

var getText = require('../utils/getText');
var lex = require('./lex');
var finish = require('./finish');
var cleanup = require('./cleanup');

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
function parseInlineToTokens(syntax, text, ctx) {
    var inlineRulesSet = syntax.getInlineRulesSet();
    var inlineRules = inlineRulesSet.getRules();

    // Parse block tokens
    var tokens = lex(inlineRules, text, ctx);

    // Parse inline content for each token
    tokens = tokens.map(function(token) {
        var rule = syntax.getInlineRule(token.getType());
        if (!rule.getOption('parseInline', true)) {
            return token;
        }

        // Parse inline content of this token
        var inlineTokens = parseInlineToTokens(syntax, token.getText(), ctx);

        token = token.set('tokens', inlineTokens);
        token = token.set('text', getText(token));

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
function parseAsContent(syntax, text, ctx) {
    text = cleanup(text);

    var blockRulesSet = syntax.getBlockRulesSet();
    var blockRules = blockRulesSet.getRules();

    // Create a new context
    ctx = createContext(ctx);

    // Parse block tokens
    var tokens = lex(blockRules, text, ctx);

    // Parse inline content for each token
    tokens = tokens.map(function(token) {
        var rule = syntax.getBlockRule(token.getType());
        if (!rule.getOption('parseInline', true)) {
            return token;
        }

        var inlineTokens = parseInlineToTokens(syntax, token.getText(), ctx);

        token = token.set('tokens', inlineTokens);
        token = token.set('text', getText(token));

        return token;
    });

    var content = Content.createFromTokens(syntax.getName(), tokens);
    return finish(syntax, content, ctx);
}

/*
    Parse an inline string to a Content

    @param {Syntax} syntax
    @param {String} text
    @param {Object} ctx
    @return {Content}
*/
function parseInline(syntax, text, ctx) {
    text = cleanup(text);

    var tokens = parseInlineToTokens(syntax, text, ctx);

    var content = Content.createFromTokens(syntax.getName(), tokens);
    return finish(syntax, content, ctx);
}

module.exports = parseAsContent;
module.exports.inline = parseInline;
