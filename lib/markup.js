var parse    = require('./parse');
var render   = require('./render');
var annotate = require('./annotate');

/**
 * Create an instance using a set of rules
 * @param {Syntax} syntax
 */
function DraftMarkup(syntax) {
    if (!(this instanceof DraftMarkup)) {
        return new DraftMarkup(syntax);
    }

    this.syntax = syntax;
}

/**
 * Convert a text into a parsed content
 * @param  {String} text
 * @return {ContentState}
 */
DraftMarkup.prototype.toContent = function toContent(text) {
    return parse(this.syntax, text);
};

/**
 * Convert a text into an inline parsed content
 * @param  {String} text
 * @return {List<Tokens>}
 */
DraftMarkup.prototype.toInlineContent = function toInlineContent(text) {
    return parse.asInline(this.syntax, text);
};

/**
 * Convert a content to text
 * @param  {ContentState} content
 * @return {String}
 */
DraftMarkup.prototype.toText = function toText(content) {
    return render(this.syntax, content);
};

/**
 * Convert a content to text
 * @param  {List<Tokens>}
 * @return {String}
 */
DraftMarkup.prototype.toInlineText = function toInlineText(tokens) {
    return render.asInline(this.syntax, tokens);
};

/**
 * Annotate a text usign an iter
 * @param  {String} text
 * @param  {Function} iter
 * @return {String}
 */
DraftMarkup.prototype.annotate = function(text, iter) {
    return annotate(this.toContent(text), iter);
};

module.exports = DraftMarkup;
