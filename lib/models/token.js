var Immutable = require('immutable');
var inherits = require('util').inherits;

var STYLES = require('../constants/styles');
var BLOCKS = require('../constants/blocks');

var isBlock = require('../utils/isBlock');
var isEntity = require('../utils/isEntity');
var isStyle = require('../utils/isStyle');

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
 * Return true if is a block token
 * @return {Boolean}
 */
Token.prototype.isBlock = function() {
    return isBlock(this);
};

/**
 * Return true if is an inline token
 * @return {Boolean}
 */
Token.prototype.isInline = function() {
    return !this.isBlock();
};

/**
 * Return true if is an inline style
 * @return {Boolean}
 */
Token.prototype.isStyle = function() {
    return isStyle(this);
};

/**
 * Return true if is an inline entity
 * @return {Boolean}
 */
Token.prototype.isEntity = function() {
    return isEntity(this);
};

/**
 * Return true if is a list item token
 * @return {Boolean}
 */
Token.prototype.isListItem = function() {
    return this.getType() === BLOCKS.UL_ITEM || this.getType() === BLOCKS.OL_ITEM;
};

/**
 * Merge this token with another one
 * @param {Token} token
 * @return {Token}
 */
Token.prototype.mergeWith = function(token) {
    return this.merge({
        type: token.getType(),
        text: this.getText() + token.getText(),
        raw:  this.getRaw() + token.getRaw(),
        data: this.getData()
            .merge(token.getData()),
        tokens: this.getTokens()
            .concat(token.getTokens())
    });
};

// ---- STATICS ----

/**
 * Create a token
 * @param {Object} tok
 * @return {Token}
 */
Token.create = function(type, tok) {
    var text = tok.text || '';

    return new Token({
        type:       type,
        text:       text,
        raw:        tok.raw || '',
        tokens:     Immutable.List(tok.tokens || []),
        data:       Immutable.Map(tok.data || {})
    });
};

/**
 * Create a token for an inline text
 * @param {String} text
 * @return {Token}
 */
Token.createInlineText = function(text) {
    return Token.create(STYLES.TEXT, {
        text: text,
        raw: text
    });
};

/**
 * Create a token for a block text
 * @param {String} raw
 * @return {Token}
 */
Token.createBlockText = function(raw) {
    var text = raw.trim();

    return Token.create(BLOCKS.TEXT, {
        text: text,
        raw: raw
    });
};

module.exports = Token;
