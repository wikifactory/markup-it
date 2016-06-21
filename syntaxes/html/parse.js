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
    var accuText = '';
    var result = [];

    var parser = new htmlparser.Parser({
        onopentag: function(name, attribs){

        },
        ontext: function(text){
            accuText += text;
        },
        onclosetag: function(tagname){
            var type = TAGS_TO_TYPE[tagname];
            if (!type) {
                return;
            }

            var token = MarkupIt.Token.create(type, {
                text: accuText
            });

            accuText = '';
        }
    }, {
        decodeEntities: true
    });

    parser.write(str);
    parser.end();

    return Immutable.List(result);
}

module.exports = htmlToTokens;
