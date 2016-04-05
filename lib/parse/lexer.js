var Immutable = require('immutable');

var Token = require('../models/token');

function Lexer(rules, ctx) {
    if (!(this instanceof Lexer)) {
        return new Lexer(rules, ctx);
    }

    this.rules = rules;
    this.ctx = ctx;
}

/*
    Process a text using the set of rules

    @param {String} text: text to parse
    @return {List<Token>}
*/
Lexer.prototype.onText = function onText(text) {
    var token;
    var tokens = new Immutable.List();

    this.rules.forEach(function(rule) {
        var match = rule.onText(this.ctx, text);
        if (!match) return;

        token = new Token({
            type: match.type,
            text: match.text,
            raw: match.raw,
            data: match.data
        });

        return false;
    }, this);

    // push new token
    tokens = tokens.push(token);

    // Update source text
    text = text.substring(token.getRaw().length);

    // Keep parsing
    if (text) {
        tokens = tokens.concat(this.onText(text));
    }

    return tokens;
};

module.exports = Lexer;
