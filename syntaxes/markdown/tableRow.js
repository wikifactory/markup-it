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
            .setOption('parse', false)
            .regExp(reTable.cellSeparation, function(match) {
                return {
                    text: match[0]
                };
            })
    )
    .replace(
        MarkupIt.Rule(MarkupIt.STYLES.TEXT)
            .setOption('parse', false)
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

    @return Array<Cell>
*/
function parseRow(text, ctx) {
    var groups = [];
    var accu = [];
    var content = MarkupIt.parseInline(rowSyntax, text, ctx);
    var tokens = content.getTokens();

    function pushCell() {
        if (accu.length == 0) return;

        var block = new MarkupIt.Token({
            type: MarkupIt.BLOCKS.UNSTYLED,
            tokens: accu
        });

        var cellContent = MarkupIt.Content.createFromTokens(
            content.getSyntax(),
            [block]
        );

        groups.push({
            key: MarkupIt.genKey(),
            content: MarkupIt.JSONUtils.encode(cellContent)
        });
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

    return groups;
}

/*
    Render a cell

    @param {Cell} cell
    @param {Object} ctx
    @return {String}
*/
function renderCell(cell, ctx) {
    var content = MarkupIt.JSONUtils.decode(cell.content);
    return MarkupIt.render(rowSyntax, content, ctx);
}

/*
    Render a row

    @param {Array<Cell>} row
    @param {Object} ctx
    @return {String}
*/
function renderRow(row, ctx) {
    return '|' + row.map(function(cell) {
        return ' ' + renderCell(cell, ctx) + ' |';
    }).join('');
}

module.exports = {
    parse: parseRow,
    render: renderRow
};
