var reBlock = require('./re/block');
var reList = require('./re/list');
var markup = require('../../');

// Return true if block is a list
function isListItem(type) {
    return (type == markup.BLOCKS.UL_ITEM || type == markup.BLOCKS.OL_ITEM);
}

// Rule for lists, rBlock.list match the whole (multilines) list, we stop at the first item
function listRule(type) {
    return markup.Rule(type)
        .regExp(reBlock.list, function(match) {
            var space;
            var rawList = match[0];
            var bull = match[2];
            var ordered = bull.length > 1;

            if (ordered && type == markup.BLOCKS.UL_ITEM) return;
            if (!ordered && type == markup.BLOCKS.OL_ITEM) return;

            // Parse first item
            var item = rawList.match(reList.item);
            var text = item[0];
            var depth = item[1].length / 2;

            // Is it the last entry of the list?
            var hasNext = Boolean(rawList.slice(item[0].length).match(reList.item));

            // Remove the bullet
            space = text.length;
            text = text.replace(reList.bullet, '');

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
            if (loose) text = text.trim();

            return {
                raw: item[0],
                text: text,
                data: {
                    depth: depth
                }
            };
        })
        .toText(function(text, block) {
            // Determine which bullet to use
            var bullet = '*';
            if (type == markup.BLOCKS.OL_ITEM) bullet = '1.';

            var nextBlock = block.next? block.next.type : null;
            var nextBlockDepth = block.next? block.next.data.depth : null;

            // Determine end of line
            var eol = '\n';

            // We finish list if:
            //    - Next block is not a list
            //    - List from a different type with same depth
            if (!isListItem(nextBlock)
                || (
                    (isListItem(nextBlock) && nextBlock != type)
                    && (block.data.depth !== (nextBlockDepth - 1))
                )
            ) {
                eol = '\n\n';
            }

            return (
                Array(block.depth + 1).join('  ') +
                bullet + ' ' +
                text + eol
            );
        });
}

module.exports = {
    ul: listRule(markup.BLOCKS.UL_ITEM),
    ol: listRule(markup.BLOCKS.OL_ITEM)
};
