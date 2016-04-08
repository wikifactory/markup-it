var MarkupIt = require('../../');

/*
    Render a list item

    @param {String} text
    @param {Token} token
    @return {String}
*/
function renderListItem(text, token) {
    var isOrdered = token.type == MarkupIt.BLOCKS.OL_ITEM;
    var listTag = isOrdered? 'ol' : 'ul';
    var depth = token.data.depth;

    var prevToken = token.prev? token.prev.type : null;
    var nextToken = token.next? token.next.type : null;

    var prevTokenDepth = token.prev? token.prev.data.depth : 0;
    var nextTokenDepth = token.next? token.next.data.depth : 0;

    var output = '';

    if (prevToken != token.type || prevTokenDepth < depth) {
        output += '<' + listTag + '>\n';
    }

    output += '<li>' + text + '</li>\n';

    if (nextToken != token.type || nextTokenDepth < depth) {
        output += '</' + listTag + '>\n';
    }

    return output;
}


var ruleOL = MarkupIt.Rule(MarkupIt.BLOCKS.OL_ITEM)
    .toText(renderListItem);

var ruleUL = MarkupIt.Rule(MarkupIt.BLOCKS.UL_ITEM)
    .toText(renderListItem);

module.exports = {
    ol: ruleOL,
    ul: ruleUL
};
