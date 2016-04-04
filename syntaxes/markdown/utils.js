var entities = require('html-entities');

var escapeStringRegexp = require('escape-string-regexp');

var htmlEntities = new entities.AllHtmlEntities();
var xmlEntities = new entities.XmlEntities();

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
    [ '_', '\\_' ],
    [ '|', '\\|' ]
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
// We escape only basic XML entities
function escapeMarkdown(str) {
    str = replacements.reduce(function(text, repl) {
        return text.replace(re(repl[0]), repl[1]);
    }, str);

    return xmlEntities.encode(str);
}

// Unescape markdown syntax
// We unescape all entities (HTML + XML)
function unescapeMarkdown(str) {
    str = replacements.reduce(function(text, repl) {
        return text.replace(re(repl[1]), repl[0]);
    }, str);

    return htmlEntities.decode(str);
}

function replace(regex, opt) {
    regex = regex.source;
    opt = opt || '';
    return function self(name, val) {
        if (!name) return new RegExp(regex, opt);
        val = val.source || val;
        val = val.replace(/(^|[^\[])\^/g, '$1');
        regex = regex.replace(name, val);
        return self;
    };
}

module.exports = {
    splitLines: splitLines,
    escape: escapeMarkdown,
    unescape: unescapeMarkdown,
    replace: replace
};
