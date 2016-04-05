var Immutable = require('immutable');

var Content = Immutable.Record({
    tokens: new Immutable.List()
});

// ---- GETTERS ----
Content.prototype.getTokens = function() {
    return this.get('tokens');
};

module.exports = Content;
