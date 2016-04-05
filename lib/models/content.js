var Immutable = require('immutable');

var Content = Immutable.Record({
    // Name of the syntax used to parse
    syntax: String(),

    // List of block tokens
    tokens: new Immutable.List()
});

// ---- GETTERS ----
Content.prototype.getTokens = function() {
    return this.get('tokens');
};

// ---- STATICS ----
Content.createFromTokens = function(syntax, tokens) {
    return new Content({
        syntax: syntax,
        tokens: new Immutable.List(tokens)
    });
};

module.exports = Content;
