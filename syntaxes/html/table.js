var MarkupIt = require('../../');

var blockRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE)
    .toText(function(state, token) {
        state._rowIndex = 0;

        return '<table>\n' + state.render(token) + '</table>\n\n';
    });

var headerRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE_HEADER)
    .toText(function(state, token) {
        return '<thead>\n' + state.render(token) + '</thead>';
    });

var bodyRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE_BODY)
    .toText(function(state, token) {
        return '<tbody>\n' + state.render(token) + '</tbody>';
    });

var rowRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE_ROW)
    .toText(function(state, token) {
        state._rowIndex = (state._rowIndex || 0) + 1;

        return '<tr>' + state.render(token) + '</tr>';
    });

var cellRule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE_CELL)
    .toText(function(state, token) {
        var isHeader  = (state._rowIndex || 0) === 0;
        var data      = token.getData();
        var align     = data.align;
        var innerHTML = state.render(token);

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