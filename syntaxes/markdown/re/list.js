var replace = require('../utils').replace;

var list = {
    list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
    item: /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,
    bullet: /^ *([*+-]|\d+\.) +/
};

list.item = replace(list.item, 'gm')
    (/bull/g, list.bullet)
    ();

module.exports = list;
