var reTable = require('./re/table');
var markup = require('../../');

var tableRow = require('./tableRow');

// Create a table entity
function Table(header, align, rows) {
    var ctx = this;

    return {
        text: ' ',
        data: {
            align: align,
            header: tableRow.parse(header, ctx),
            rows: rows.map(function(row) {
                return tableRow.parse(row, ctx);
            })
        }
    };
}

// Detect alignement per column
function mapAlign(align) {
    return align.map(function(s) {
        if (reTable.alignRight.test(s)) {
            return 'right';
        } else if (reTable.alignCenter.test(s)) {
            return 'center';
        } else if (reTable.alignLeft.test(s)) {
            return 'left';
        } else {
            return null;
        }
    });
}

// Render a cell as text
function cellToText(cell) {
    var output = this.createOutputSession();
    output.processInline(cell.content);

    return output.toText();
}

// Render a row as text
function rowToText(row) {
    var that = this;

    return '|' + row.map(function(cell) {
        return ' ' + cellToText.call(that, cell) + ' |';
    }).join('');
}

// Render align to text
function alignToText(row) {
    return '|' + row.map(function(align) {
        if (align == 'right') {
            return ' ---: |';
        } else if (align == 'left') {
            return ' :--- |';
        } else if (align == 'center') {
            return ' :---: |';
        } else  {
            return ' --- |';
        }
    }).join('');
}

var blockRule = markup.Rule(markup.BLOCKS.TABLE)

    // table no leading pipe (gfm)
    .regExp(reTable.nptable, function(match) {
        var header = match[1];
        var align = match[2]
            .replace(reTable.trailingPipeAlign, '')
            .split(reTable.cell);
        var rows = match[3]
            .replace(/\n$/, '')
            .split('\n');

        // Align for columns
        align = mapAlign(align);

        return Table.call(this, header, align, rows);
    })

    // normal table
    .regExp(reTable.normal, function(match) {
        var header =  match[1];
        var align = match[2]
            .replace(reTable.trailingPipeAlign, '')
            .split(reTable.cell);
        var rows = match[3]
            .replace(reTable.trailingPipeCell, '')
            .replace(/\n$/, '')
            .split('\n');

        // Align for columns
        align = mapAlign(align);

        return Table.call(this, header, align, rows);

    })

    // Output table as text
    .toText(function(inner, block) {
        var that = this;
        var result = '';
        var align = block.data.align || [];
        var header = block.data.header || [];
        var rows = block.data.rows || [];

        result += rowToText.call(this, header) + '\n';
        result += alignToText(align) + '\n';
        result += rows.map(function(row) {
            return rowToText.call(that, row);
        }).join('\n');

        return (result + '\n\n');
    });

module.exports = {
    block: blockRule
};
