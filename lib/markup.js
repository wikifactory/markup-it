var ParsingSession = require('./parse');
var OutputSession = require('./output');

// Create an instance using a set of rules
function DraftMarkup(syntax) {
    if (!(this instanceof DraftMarkup)) return new DraftMarkup(syntax);

    this.syntax = syntax;
}

// Convert a text into a ContentState for draft-js
DraftMarkup.prototype.toRawContent = function toRawContent(text) {
    // Create a new session
    return ParsingSession(this.syntax)

        // Process the text
        .process(text)

        // Return raw content
        .toRawContent();
};

// Convert a ContentState from draft-js into a string
DraftMarkup.prototype.toText = function toText(rawContent) {
    // Create a new session
    return OutputSession(this.syntax)

        // Process the raw content
        .process(rawContent)

        // Return text
        .toText();
};

module.exports = DraftMarkup;
