var parse = require('./parse');
var render = require('./render');

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
 * Convert a content to text
 * @param  {ContentState} content
 * @return {String}
 */
DraftMarkup.prototype.toText = function toText(content) {
    return render(this.syntax, content);
};

module.exports = DraftMarkup;
