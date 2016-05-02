var Immutable = require('immutable');

var Content = Immutable.Record({
    // Name of the syntax used to parse
    syntax: String(),

    // List of block tokens
    tokens: new Immutable.List()
});

// ---- GETTERS ----
Content.prototype.getSyntax = function() {
    return this.get('syntax');
};

Content.prototype.getTokens = function() {
    return this.get('tokens');
};

// ---- STATICS ----

/**
    Create a content from a syntax and a list of tokens

    @param {Syntax} syntax
    @param {Array|List<Token>}
    @return {Content}
*/
Content.createFromTokens = function(syntax, tokens) {
    return new Content({
        syntax: syntax,
        tokens: new Immutable.List(tokens)
    });
};

module.exports = Content;
