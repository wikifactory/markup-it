var reBlock = require('kramed/lib/rules/block');
var markup = require('../../');

// Create a table entity
function Table(header, aligns, rows) {
    var that = this;

    function cell(text, i) {
        var parser = that.createParsingSession();

        parser.process(text);

        return {
            align: aligns[i],
            content: parser.toRawContent()
        };
    }

    return {
        text: ' ',
        data: {
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
        if (/^ *-+: *$/.test(s)) {
            return 'right';
        } else if (/^ *:-+: *$/.test(s)) {
            return 'center';
        } else if (/^ *:-+ *$/.test(s)) {
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

// Render a row as text
function rowToText(row) {
    return '|' + row.map(function(cell) {
        return ' ' + cell + ' |';
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
        var header = match[1].replace(/^ *| *\| *$/g, '').split(/ *\| */);
        var align = match[2].replace(/^ *|\| *$/g, '').split(/ *\| */);
        var rows = match[3].replace(/\n$/, '').split('\n');

        // Align for columns
        align = mapAlign(align);

        // Split each row into cells
        rows = splitRows(rows);

        return Table.call(this, header, align, rows);
    })

    // normal table
    .regExp(reBlock.tables.table, function(match) {
        var header =  match[1].replace(/^ *| *\| *$/g, '').split(/ *\| */);
        var align = match[2].replace(/^ *|\| *$/g, '').split(/ *\| */);
        var rows = match[3].replace(/(?: *\| *)?\n$/, '').split('\n').slice(0);

        // Align for columns
        align = mapAlign(align);

        // Split each row into cells
        rows = splitRows(rows);

        return Table.call(this, header, align, rows);

    })

    // Output table as text
    .toText(function(inner, block) {
        var result = '';
        var align = block.data.align || [];
        var header = block.data.header || [];
        var rows = block.data.rows || [];

        result += rowToText(header) + '\n';
        result += alignToText(align) + '\n';
        result += rows.map(function(row) {
            return rowToText(row);
        }).join('\n');

        return (result + '\n\n');
    });

module.exports = {
    block: blockRule
};
