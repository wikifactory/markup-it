var Immutable = require('immutable');
var htmlparser = require('htmlparser2');
var markup = require('../../');

var TAGS_TO_TYPE = {
    a:              markup.ENTITIES.LINK,
    img:            markup.ENTITIES.IMAGE,

    h1:             markup.BLOCKS.HEADING_1,
    h2:             markup.BLOCKS.HEADING_2,
    h3:             markup.BLOCKS.HEADING_3,
    h4:             markup.BLOCKS.HEADING_4,
    h5:             markup.BLOCKS.HEADING_5,
    h6:             markup.BLOCKS.HEADING_6,
    pre:            markup.BLOCKS.CODE,
    blockquote:     markup.BLOCKS.BLOCKQUOTE,
    p:              markup.BLOCKS.PARAGRAPH,
    hr:             markup.BLOCKS.HR,

    b:              markup.INLINES.BOLD,
    strike:         markup.INLINES.STRIKETHROUGH,
    em:             markup.INLINES.ITALIC,
    code:           markup.INLINES.CODE
};

/**
    Parse an HTML string into a token tree

    @param {String} str
    @return {List<Token>}
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

            var token = new markup.Token({
                type: type,
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
