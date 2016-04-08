var replace = require('../utils').replace;

var list = {
    list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
    item: /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,
    bullet: /(?:[*+-]|\d+\.)/,
    bulletAndSpaces: /^ *([*+-]|\d+\.) +/
};

list.item = /^( *)((?:[*+-]|\d+\.)) [^\n]*(?:\n(?!(?:[*+-]|\d+\.) ))*/ /*replace(list.item)
    (/bull/g, list.bullet)
    ();*/

module.exports = list;
