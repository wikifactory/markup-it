var parse = require('./parse');
var render = require('./render');

// Create an instance using a set of rules
function DraftMarkup(syntax) {
    if (!(this instanceof DraftMarkup)) return new DraftMarkup(syntax);

    this.syntax = syntax;
}

// Convert a text into a ContentState for draft-js
DraftMarkup.prototype.toContent = function toContent(text) {
    return parse(this.syntax, text);
};

// Convert a ContentState from draft-js into a string
DraftMarkup.prototype.toText = function toText(content) {
    return render.withSyntax(this.syntax, content);
};

module.exports = DraftMarkup;
