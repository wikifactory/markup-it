var escapeStringRegexp = require('escape-string-regexp');

// Replacements for Markdown escaping
var replacements = [
    [ '*', '\\*' ],
    [ '#', '\\#' ],
    [ '/', '\\/' ],
    [ '(', '\\(' ],
    [ ')', '\\)' ],
    [ '[', '\\[' ],
    [ ']', '\\]' ],
    [ '<', '&lt;' ],
    [ '>', '&gt;' ],
    [ '_', '\\_' ]
];

// Split a text into lines
function splitLines(text) {
    return text.split(/\r?\n/);
}

// Build a regexp from a string
function re(str) {
    return new RegExp(escapeStringRegexp(str), 'g');
}

// Escape markdown syntax
function escapeMarkdown(str) {
    return replacements.reduce(function(text, repl) {
        return text.replace(re(repl[0]), repl[1]);
    }, str);
}

// Unescape markdown syntax
function unescapeMarkdown(str) {
    return replacements.reduce(function(text, repl) {
        return text.replace(re(repl[1]), repl[0]);
    }, str);
}

module.exports = {
    splitLines: splitLines,
    escape: escapeMarkdown,
    unescape: unescapeMarkdown
}
