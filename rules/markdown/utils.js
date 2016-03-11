// Split a text into lines
function splitLines(text) {
    return text.split(/\r?\n/);
}

// Escape markdown syntax
function escapeMarkdown(str) {
    return str.replace(/\*/g, '\\*');
}

// Unescape markdown syntax
function unescapeMarkdown(str) {
    return str.replace(/\\\\*/g, '\\*');
}

module.exports = {
    splitLines: splitLines,
    escape: escapeMarkdown,
    unescape: unescapeMarkdown
}
