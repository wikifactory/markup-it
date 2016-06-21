var MarkupIt = require('../../');

var reTable = require('./re/table');
var inlineRules = require('./inline');
var utils = require('./utils');

var CELL_SEPARATOR = 'cell';

/*
 * Custom inline syntax to parse each row with custom cell separator tokens
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
            .regExp(reTable.cellInlineEscape, function(state, match) {
                return {
                    text: utils.unescape(match[0])
                };
            })
            .regExp(reTable.cellInlineText, function(state, match) {
                return {
                    text: utils.unescape(match[0])
                };
            })
            .toText(utils.escape)
    );

/**
 * Parse a row from a table
 *
 * @param {ParsingState} state
 * @param {String} text
 * @return {Token}
 */
function parseRow(state, text) {
    var cells = [];
    var accu = [];
    var tokens = state.parse(rowRules, true, text);

    function pushCell() {
        if (accu.length == 0) {
            return;
        }

        var cell = MarkupIt.Token.create(MarkupIt.BLOCKS.TABLE_CELL, {
            tokens: accu
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
