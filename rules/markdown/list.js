var rBlock = require('kramed/lib/rules/block');
var BLOCKS = require('../../').BLOCKS;

var reItem = /^( *)((?:[*+-]|\d+\.)) [^\n]*(?:\n(?!(?:[*+-]|\d+\.) ))*/;
var reBullet = /^ *([*+-]|\d+\.) +/;

// Rule for lists, rBlock.list match the whole (multilines) list, we stop at the first item
function listRule(type) {
    return {
        type: type,
        regexp: rBlock.list,
        props: function(match) {
            var bull = match[2];
            var ordered = bull.length > 1;

            if (ordered && type == BLOCKS.UL_ITEM) return;
            if (!ordered && type == BLOCKS.OL_ITEM) return;

            // Parse first item
            var item = match[0].match(reItem);
            var text = item[0];
            var depth = item[1].length / 2;

            // Remove the bullet
            text = text.replace(reBullet, '');

            // Trim to remove spaces and new line
            text = text.trim();

            return {
                raw: item[0],
                text: text,
                depth: depth
            };
        },
        toText: function(text, block, ctx) {
            // Determine which bullet to use
            var bullet = '*';
            if (type == BLOCKS.OL_ITEM) bullet = '1.';

            // Determine end of line
            var eol = (ctx.next && (ctx.next.type == BLOCKS.OL_ITEM || ctx.next.type == BLOCKS.UL_ITEM))? '\n' : '\n\n';

            return (
                Array(block.depth + 1).join('  ') +
                bullet + ' ' +
                text + eol
            );
        }
    };
}

module.exports = {
    rule: listRule
};
