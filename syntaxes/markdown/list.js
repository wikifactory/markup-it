var rBlock = require('kramed/lib/rules/block');
var markup = require('../../');

var reItem = /^( *)((?:[*+-]|\d+\.)) [^\n]*(?:\n(?!(?:[*+-]|\d+\.) ))*/;
var reBullet = /^ *([*+-]|\d+\.) +/;

// Rule for lists, rBlock.list match the whole (multilines) list, we stop at the first item
function listRule(type) {
    return markup.Rule(type)
        .regExp(rBlock.list, function(match) {
            var space;
            var rawList = match[0];
            var bull = match[2];
            var ordered = bull.length > 1;

            if (ordered && type == markup.BLOCKS.UL_ITEM) return;
            if (!ordered && type == markup.BLOCKS.OL_ITEM) return;

            // Parse first item
            var item = rawList.match(reItem);
            var text = item[0];
            var depth = item[1].length / 2;

            // Is it the last entry of the list?
            var hasNext = Boolean(rawList.slice(item[0].length).match(reItem));

            // Remove the bullet
            space = text.length;
            text = text.replace(reBullet, '');

            // Outdent whatever the
            // list item contains. Hacky.
            if (~text.indexOf('\n ')) {
                space -= item.length;
                text = text.replace(new RegExp('^ {1,' + space + '}', 'gm'), '');
            }

            // Determine whether item is loose or not.
            // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
            // for discount behavior.
            var loose = this.listNext || /\n\n(?!\s*$)/.test(text);
            if (hasNext) {
                this.listNext = text.charAt(text.length - 1) === '\n';
                if (!loose) loose = hasNext;
            } else {
                this.listNext = false;
            }

            // Trim to remove spaces and new line
            if (loose) text = text.replace(/\n$/, '');

            return {
                raw: item[0],
                text: text,
                depth: depth
            };
        })
        .toText(function(text, entity, ctx) {
            // Determine which bullet to use
            var bullet = '*';
            if (type == markup.BLOCKS.OL_ITEM) bullet = '1.';

            // Determine end of line
            var eol = '\n';

            return (
                Array(ctx.depth + 1).join('  ') +
                bullet + ' ' +
                text + eol
            );
        });
}

module.exports = {
    ul: listRule(markup.BLOCKS.UL_ITEM),
    ol: listRule(markup.BLOCKS.OL_ITEM)
};
