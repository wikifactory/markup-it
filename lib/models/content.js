var Immutable = require('immutable');

var Content = Immutable.Record({
    tokens: new Immutable.List()
});

// ---- GETTERS ----
Content.prototype.getTokens = function() {
    return this.get('tokens');
};

// ---- STATICS ----
Content.createFromTokens = function(tokens) {
    return new Content({
        tokens: new Immutable.List(tokens)
    });
};

module.exports = Content;
