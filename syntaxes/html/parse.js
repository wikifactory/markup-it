var Immutable = require('immutable');
var htmlparser = require('htmlparser2');
var MarkupIt = require('../../');

var TAGS_TO_TYPE = {
    a:              MarkupIt.ENTITIES.LINK,
    img:            MarkupIt.ENTITIES.IMAGE,

    h1:             MarkupIt.BLOCKS.HEADING_1,
    h2:             MarkupIt.BLOCKS.HEADING_2,
    h3:             MarkupIt.BLOCKS.HEADING_3,
    h4:             MarkupIt.BLOCKS.HEADING_4,
    h5:             MarkupIt.BLOCKS.HEADING_5,
    h6:             MarkupIt.BLOCKS.HEADING_6,
    pre:            MarkupIt.BLOCKS.CODE,
    blockquote:     MarkupIt.BLOCKS.BLOCKQUOTE,
    p:              MarkupIt.BLOCKS.PARAGRAPH,
    hr:             MarkupIt.BLOCKS.HR,

    table:          MarkupIt.BLOCKS.TABLE,
    tr:             MarkupIt.BLOCKS.TR_ROW,
    td:             MarkupIt.BLOCKS.TABLE_CELL,

    ul:             MarkupIt.BLOCKS.LIST_UL,
    ol:             MarkupIt.BLOCKS.LIST_OL,
    li:             MarkupIt.BLOCKS.LIST_ITEM,

    b:              MarkupIt.STYLES.BOLD,
    strike:         MarkupIt.STYLES.STRIKETHROUGH,
    em:             MarkupIt.STYLES.ITALIC,
    code:           MarkupIt.STYLES.CODE
};

/**
 * Parse an HTML string into a token tree
 * @param {String} str
 * @return {List<Token>}
 */
function htmlToTokens(str) {
    var result = [];
    var stack = [];

    function pushToLast(tok) {
        if (stack.length > 0) {
            stack[stack.length - 1] = stack[stack.length - 1].pushToken(tok);
        } else {
            result.push(tok);
        }
    }

    var parser = new htmlparser.Parser({
        onopentag: function(tagName, attribs) {
            var type = TAGS_TO_TYPE[tagName];
            if (!type) {
                return;
            }

            var token = MarkupIt.Token.create(type, {
                data: {}
            });

            stack.push(token);
        },
        ontext: function(text) {
            if (!text.trim()) {
                return;
            }

            var textNode = MarkupIt.Token.createText(text);
            pushToLast(textNode);
        },
        onclosetag: function(tagName) {
            var type = TAGS_TO_TYPE[tagName];
            if (!type) {
                return;
            }

            var lastToken = stack.pop();
            pushToLast(lastToken);
        }
    }, {
        decodeEntities: true
    });

    parser.write(str);
    parser.end();

    return Immutable.List(result);
}

module.exports = htmlToTokens;
