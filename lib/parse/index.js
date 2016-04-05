var Content = require('../models/content');

var Lexer = require('./lexer');

/*
    ParsingSession instance represents
    one transformation from Text to a Content instance
*/

function ParsingSession(syntax, ctx) {
    if (!(this instanceof ParsingSession)) {
        return new ParsingSession(syntax, ctx);
    }

    this.syntax = syntax;

    this.blockLexer = new Lexer(this.syntax.getBlockRules());
    this.inlineLexer = new Lexer(this.syntax.getInlineRules());

    // Shared context for all rules during this session
    // Rules can store variables in it
    this.ctx = ctx || {};

    this.ctx.createParsingSession = function() {
        return new ParsingSession(syntax, {});
    };

    // Output
    this.content = new Content();
}

/*
    Return current content
    @return {Content}
*/
ParsingSession.prototype.getContent = function() {
    return this.content;
};

/*
    Process a text using a set of rules
    @param {String} text: text to parse
    @chainable
*/
ParsingSession.prototype.process = function process(text) {
    var tokens = this.blockLexer.onText(text);
    var blockRulesSet = this.syntax.getBlockRulesSet();

    // Parse inline content
    tokens = tokens.map(function(token) {
        var rule = blockRulesSet.getRule(token.getType());
        var parseInline = rule.getOption('parseInline', true);

        if (!parseInline) return token;

        var inlineTokens = this.inlineLexer.onText(token.getText());


        token = token.set('tokens', inlineTokens);
        return token;
    }, this);

    // Set tokens in content
    this.content = this.content.set('tokens', tokens);

    return this;
};

module.exports = ParsingSession;
