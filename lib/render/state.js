var Token = require('../models/token');

function RenderingState(syntax) {
    if (!(this instanceof RenderingState)) {
        return new RenderingState(syntax);
    }

    this.syntax = syntax;
}

/**
 * Render a token using a set of rules
 * @param {RulesSet} rules
 * @param {Boolean} isInline
 * @param {Token|List<Token>} tokens
 * @return {List<Token>}
 */
RenderingState.prototype.render = function(tokens) {
    var state = this;
    var syntax = this.syntax;

    if (tokens instanceof Token) {
        var token = tokens;
        tokens = token.getTokens();

        if (tokens.size === 0) {
            return token.getAsPlainText();
        }
    }

    return tokens.reduce(function(text, token) {
        var tokenType = token.getType();
        var rule = (token.isInline()? syntax.getInlineRule(tokenType)
            : syntax.getBlockRule(tokenType));

        if (!rule) {
            throw new Error('Unexpected error: no rule to render "' + tokenType + '"');
        }

        return text + rule.onToken(state, token);
    }, '');
};

RenderingState.prototype.renderAsInline = function(tokens) {
    return this.render(tokens);
};

RenderingState.prototype.renderAsBlock = function(tokens) {
    return this.render(tokens);
};

module.exports = RenderingState;
