var replace = require('../utils').replace;

var list = {
    list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
    item: /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,
    bullet: /(?:[*+-]|\d+\.)/,
    bulletAndSpaces: /^ *([*+-]|\d+\.) +/
};

list.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
list.item = replace(list.item, 'gm')
  (/bull/g, list.bullet)
  ();

/^( *)((?:[*+-]|\d+\.)) [^\n]*(?:\n(?!(?:[*+-]|\d+\.) ))*/gm  /*replace(list.item)
    (/bull/g, list.bullet)
    ();*/

module.exports = list;
