var Immutable = require('immutable');
var inherits = require('util').inherits;

var STYLES = require('../constants/styles');
var BLOCKS = require('../constants/blocks');

var blockTypes = Immutable.Map(BLOCKS).valueSeq();

var TokenRecord = Immutable.Record({
    // Type of token
    type: String(),

    // Metadata for this token
    data: new Immutable.Map(),

    // Inner text of this token (for inline tokens)
    text: String(),

    // Original raw content of this token
    raw: String(),

    // List of children tokens (for block tokens)
    tokens: new Immutable.List()
});


function Token(def) {
    if (!(this instanceof Token)) {
        return new Token(def);
    }

    TokenRecord.call(this, {
        type: def.type,
        data: new Immutable.Map(def.data),
        text: def.text,
        raw: def.raw,
        tokens: new Immutable.List(def.tokens)
    });
}
inherits(Token, TokenRecord);

// ---- GETTERS ----
Token.prototype.getType = function() {
    return this.get('type');
};

Token.prototype.getData = function() {
    return this.get('data');
};

Token.prototype.getText = function() {
    return this.get('text');
};

Token.prototype.getRaw = function() {
    return this.get('raw');
};

Token.prototype.getTokens = function() {
    return this.get('tokens');
};

/**
    Return true if is an inline token

    @return {Boolean}
*/
Token.prototype.isInline = function() {
    var type = this.getType();
    return !blockTypes.includes(type);
};

// ---- STATICS ----

/**
    Create a token for an inline text

    @param {String} text
    @return {Token}
*/
Token.createInlineText = function(text) {
    return new Token({
        type: STYLES.TEXT,
        text: text,
        raw: text
    });
};

/**
    Create a token for a block text

    @param {String} text
    @return {Token}
*/
Token.createBlockText = function(text) {
    return new Token({
        type: BLOCKS.UNSTYLED,
        text: text,
        raw: text
    });
};

module.exports = Token;
