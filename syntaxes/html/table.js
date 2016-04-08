var MarkupIt = require('../../');
var inlineRules = require('./inline');

var cellSyntax = MarkupIt.Syntax('html+cell', {
    inline: inlineRules
});

/*
    Render a cell to HTML
*/
function renderCell(cell, align, isHeader) {
    var type = isHeader ? 'th' : 'td';
    var tag = align
    ? '<' + type + ' style="text-align:' + align + '">'
    : '<' + type + '>';

    var content = MarkupIt.JSONUtils.decode(cell.content);
    var innerHTML = MarkupIt.render(cellSyntax, content);

    return tag + innerHTML + '</' + type + '>\n';
}

/*
    Render a row to HTML
*/
function renderRow(cells, align, isHeader) {
    var content = cells.reduce(function(result, cell, i) {
        return result + renderCell(cell, align[i], isHeader);
    }, '');

    return '<tr>\n' + content + '</tr>\n';
}

/*
    Render an array of row to HTML
*/
function renderRows(rows, align) {
    return rows.map(function(row) {
        return renderRow(row, align, false);
    }).join('');
}

var rule = MarkupIt.Rule(MarkupIt.BLOCKS.TABLE)
    .toText(function(text, token) {
        var table = token.data;

        return '<table>\n' +
            '<thead>\n' +
                renderRow(table.header, table.align, true) +
            '</thead>' +
            '<tbody>\n' +
                renderRows(table.rows, table.align) +
            '</tbody>' +
        '</table>\n\n';
    });


module.exports = rule;