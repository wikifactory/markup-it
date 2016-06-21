var MarkupIt = require('../../');

var reTable = require('./re/table');
var inlineRules = require('./inline');
var utils = require('./utils');

var CELL_SEPARATOR = 'cell';

/*
    Custom inline syntax to parse each row with custom cell separator tokens
*/
var rowRules = inlineRules
    .unshift(
        MarkupIt.Rule(CELL_SEPARATOR)
            .regExp(reTable.cellSeparation, function(match) {
                return {
                    text: match[0]
                };
            })
    )
    .replace(
        MarkupIt.Rule(MarkupIt.STYLES.TEXT)
            .regExp(reTable.cellInlineEscape, function(match) {
                return {
                    text: utils.unescape(match[0])
                };
            })
            .regExp(reTable.cellInlineText, function(match) {
                return {
                    text: utils.unescape(match[0])
                };
            })
            .toText(utils.escape)
    );

var rowSyntax = MarkupIt.Syntax('markdown+row', {
    inline: rowRules
});

/*
    Parse a row from a table

    @param {String} text
    @param {Object} ctx
    @param {Array<String>} align

    @return {Token}
*/
function parseRow(text, ctx, align) {
    var cells = [];
    var accu = [];
    var content = MarkupIt.parseInline(rowSyntax, text, ctx);
    var tokens = content.getTokens();

    function pushCell() {
        if (accu.length == 0) return;

        var cell = MarkupIt.Token.create(MarkupIt.BLOCKS.TABLE_CELL, {
            tokens: accu,
            data: {
                align: align[cells.length]
            }
        });

        cells.push(cell);
        accu = [];
    }

    tokens.forEach(function(token) {
        if (token.getType() == CELL_SEPARATOR) {
            pushCell();
        } else {
            accu.push(token);
        }
    });

    pushCell();

    return MarkupIt.Token.create(MarkupIt.BLOCKS.TABLE_ROW, {
        tokens: cells
    });
}

module.exports = {
    parse: parseRow
};
