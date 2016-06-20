var Immutable = require('immutable');

var Token = require('../models/token');
var Content = require('../models/content');
var getText = require('../utils/getText');
var lex = require('./lex');
var finish = require('./finish');
var cleanup = require('./cleanup');

function createContext(ctx) {
    return (ctx || {});
}

/**
 * Parse an inline text into a list of tokens
 *
 * @param {Syntax} syntax
 * @param {String} text
 * @param {List<Token>} parents
 * @param {Object} ctx
 * @return {List<Token>}
 */
function parseAsInlineTokens(syntax, text, parents, ctx) {
    var inlineRulesSet = syntax.getInlineRulesSet();
    var inlineRules = inlineRulesSet.getRules();

    // Parse block tokens
    var tokens = lex.inline(inlineRules, text, parents, ctx);

    // Parse inline content for each token
    tokens = tokens.map(function(token) {
        return parseInnerToken(syntax, token, parents, ctx);
    });

    return tokens;
}


/**
 * Parse a text using a syntax into a list of block tokens
 *
 * @param {Syntax} syntax
 * @param {String} text
 * @param {List<Token>} parents
 * @param {Object} ctx
 * @return {List<Token>}
 */
function parseAsBlockTokens(syntax, text, parents, ctx) {
    text = cleanup(text);

    var blockRulesSet = syntax.getBlockRulesSet();
    var blockRules = blockRulesSet.getRules();

    // Parse block tokens
    var tokens = lex.block(blockRules, text, parents, ctx);

    // Parse inline content for each token
    tokens = tokens.map(function(token) {
        return parseInnerToken(syntax, token, parents, ctx);
    });

    return tokens;
}

/**
 * Parse inner of a token according to the options.
 * It returns the modified token.
 *
 * @param {Syntax} syntax
 * @param {Token} token
 * @param {List<Token>} parents
 * @param {Object} ctx
 * @return {Token}
 */
function parseInnerToken(syntax, token, parents, ctx) {
    var tokenType = token.getType();
    var rule = (token.isInline()?
        syntax.getInlineRule(tokenType) :
        syntax.getBlockRule(tokenType)
    );
    var parseMode = rule.getOption('parse');

    if (!parseMode) {
        return token;
    }

    // Add it to the new parents list
    parents = parents.push(token);

    // Parse inner tokens if none
    var tokens = token.getTokens();
    if (tokens.size === 0) {
        if (parseMode === 'block') {
            tokens = parseAsBlockTokens(syntax, token.getText(), parents, ctx);
        } else {
            tokens = parseAsInlineTokens(syntax, token.getText(), parents, ctx);
        }

        token = token.set('tokens', tokens);
    }

    token = token.set('text', getText(token));

    return token;
}

/**
 * Parse a text using a syntax into a Content
 *
 * @param {Syntax} syntax
 * @param {String} text
 * @param {Object} ctx
 * @return {Content}
 */
function parseAsContent(syntax, text, ctx) {
    // Create a new context
    ctx = createContext(ctx);

    // Parse inline content for each token
    var tokens = parseAsBlockTokens(syntax, text, Immutable.List(), ctx);

    // We always return at least one block token
    if (tokens.size === 0) {
        tokens = tokens.push(Token.createBlockText(''));
    }

    var content = Content.createFromTokens(syntax.getName(), tokens);
    return finish(syntax, content, ctx);
}

/**
 * Parse an inline string to a Content
 *
 * @param {Syntax} syntax
 * @param {String} text
 * @param {Object} ctx
 * @return {Content}
 */
function parseInline(syntax, text, ctx) {
    text = cleanup(text);

    var tokens = parseAsInlineTokens(syntax, text, Immutable.List(), ctx);

    var content = Content.createFromTokens(syntax.getName(), tokens);
    return finish(syntax, content, ctx);
}

module.exports = parseAsContent;
module.exports.inline = parseInline;
