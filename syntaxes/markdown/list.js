var reBlock = require('./re/block');
var markup = require('../../');
var utils = require('./utils');

var reList = reBlock.list;

// Return true if block is a list
function isListItem(type) {
    return (type == markup.BLOCKS.UL_ITEM || type == markup.BLOCKS.OL_ITEM);
}

// Rule for lists, rBlock.list match the whole (multilines) list, we stop at the first item
function listRule(type) {
    return markup.Rule(type)
        .regExp(reList.block, function(match) {
            var rawList = match[0];
            var bull = match[2];
            var ordered = bull.length > 1;

            if (ordered && type === markup.BLOCKS.UL_ITEM) return;
            if (!ordered && type === markup.BLOCKS.OL_ITEM) return;

            var item, loose, next = false;

            var lastIndex = 0;
            var result = [];
            var rawItem, textItem, space, items = [];

            // Extract all items
            reList.item.lastIndex = 0;
            while ((item = reList.item.exec(rawList)) !== null) {
                rawItem = rawList.slice(lastIndex, reList.item.lastIndex);
                lastIndex = reList.item.lastIndex;


                items.push([item, rawItem]);
            }

            for (var i = 0; i < items.length; i++) {
                item = items[i][0];
                rawItem = items[i][1];

                // Remove the list item's bullet
                // so it is seen as the next token.
                textItem = item[0];
                space = textItem.length;
                textItem = textItem.replace(/^ *([*+-]|\d+\.) +/, '');

                // Outdent whatever the
                // list item contains. Hacky.
                if (~textItem.indexOf('\n ')) {
                    space -= textItem.length;
                    textItem =  textItem.replace(new RegExp('^ {1,' + space + '}', 'gm'), '');
                }

                // Determine whether item is loose or not.
                // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
                // for discount behavior.
                loose = next || /\n\n(?!\s*$)/.test(textItem);
                if (i !== items.length - 1) {
                    next = textItem.charAt(textItem.length - 1) === '\n';
                    if (!loose) loose = next;
                }

                result.push({
                    type: type,
                    raw: rawItem,
                    text: textItem,
                    data:{
                        loose: loose
                    }
                });
            }


            return result;
        })
        .toText(function(text, block) {
            // Determine which bullet to use
            var bullet = '*';
            if (type == markup.BLOCKS.OL_ITEM) {
                bullet = '1.';
            }

            var nextBlock = block.next? block.next.type : null;

            // Prepend text with spacing
            var rows = utils.splitLines(text);
            var head = rows[0];
            var rest = utils.indent(rows.slice(1).join('\n'), '  ');

            var eol = rest? '' : '\n';
            if (nextBlock && !isListItem(nextBlock)) {
                eol += '\n';
            }

            var result = bullet + ' ' + head + (rest ? '\n' + rest : '') + eol;

            return result;
        });
}

module.exports = {
    ul: listRule(markup.BLOCKS.UL_ITEM),
    ol: listRule(markup.BLOCKS.OL_ITEM)
};
