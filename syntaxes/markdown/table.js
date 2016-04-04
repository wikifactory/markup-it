var reBlock = require('kramed/lib/rules/block');
var reTable = require('kramed/lib/rules/table');
var markup = require('../../');

// Create a table entity
function Table(header, align, rows) {
    var that = this;

    // Parse a cell and returns the content as data
    function cell(text, i) {
        var parser = that.createParsingSession();
        parser.process(text);

        return {
            key: null,
            content: parser.toRawContent()
        };
    }

    return {
        text: ' ',
        data: {
            align: align,
            header: header.map(cell),
            rows: rows.map(function(cells) {
                return cells.map(cell);
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

// Split rows into cells
function splitRows(rows) {
    return rows = rows.map(function(row) {
        return row
            .replace(/^ *\| *| *\| *$/g, '')
            .split(/ *\| */);
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
    .regExp(reBlock.tables.nptable, function(match) {
        var header = match[1]
            .replace(/\\\|/g, '&#124;')
            .replace(reTable.trailingPipe, '')
            .split(reTable.cell);
        var align = match[2]
            .replace(/\\\|/g, '&#124;')
            .replace(reTable.trailingPipeAlign, '')
            .split(reTable.cell);
        var rows = match[3]
            .replace(/\\\|/g, '&#124;')
            .replace(/\n$/, '')
            .split('\n');

        // Align for columns
        align = mapAlign(align);

        // Split each row into cells
        rows = splitRows(rows);

        return Table.call(this, header, align, rows);
    })

    // normal table
    .regExp(reBlock.tables.table, function(match) {
        var header =  match[1]
            .replace(/\\\|/g, '&#124;')
            .replace(reTable.trailingPipe, '')
            .split(reTable.cell);
        var align = match[2]
            .replace(/\\\|/g, '&#124;')
            .replace(reTable.trailingPipeAlign, '')
            .split(reTable.cell);
        var rows = match[3]
            .replace(/\\\|/g, '&#124;')
            .replace(reTable.trailingPipeCell, '')
            .replace(/\n$/, '')
            .split('\n');

        // Align for columns
        align = mapAlign(align);

        // Split each row into cells
        rows = splitRows(rows);

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
