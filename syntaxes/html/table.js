var MarkupIt = require('../../');

var blockRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE)
    .toText(function(innerHTML) {
        this._rowIndex = 0;

        return '<table>\n' + innerHTML + '</table>\n\n';
    });

var headerRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE_HEADER)
    .toText(function(innerHTML) {
        return '<thead>\n' + innerHTML + '</thead>';
    });

var bodyRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE_BODY)
    .toText(function(innerHTML) {
        return '<tbody>\n' + innerHTML + '</tbody>';
    });

var rowRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE_ROW)
    .toText(function(innerHTML) {
        this._rowIndex = (this._rowIndex || 0) + 1;

        return '<tr>' + innerHTML + '</tr>';
    });

var cellRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE_CELL)
    .toText(function(innerHTML, token) {
        var isHeader = (this._rowIndex || 0) === 0;
        var align = token.data.align;

        var type = isHeader ? 'th' : 'td';
        var tag = align
        ? '<' + type + ' style="text-align:' + align + '">'
        : '<' + type + '>';

        return tag + innerHTML + '</' + type + '>\n';
    });

module.exports = {
    block:      blockRule,
    header:     headerRule,
    body:       bodyRule,
    row:        rowRule,
    cell:       cellRule
};