var replace = require('../utils').replace;
var list = require('./list');

var block = {
    newline: /^\n+/,
    code: /^((?: {4}|\t)[^\n]+\n*)+/,
    hr: /^( *[-*_]){3,} *(?:\n|$)/,
    blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
    html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n|$)/,
    footnote: /^\[\^([^\]]+)\]: ([^\n]+)/,
    paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def|math))+)\n*/,
    text: /^[^\n]+/,
    fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n|$)/,
    yamlHeader: /^ *(?=```)/,
    list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/
};

block.list = replace(block.list)
    (/bull/g, list.bullet)
    ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
    ('def', '\\n+(?=' + block.def.source + ')')
    ('footnote', block.footnote)
    ();

block.paragraph = replace(block.paragraph)('(?!', '(?!'
        + block.fences.source.replace('\\1', '\\2') + '|'
        + block.list.source.replace('\\1', '\\3') + '|')
    ();


module.exports = block;
