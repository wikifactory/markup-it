var reBlock = require('kramed/lib/rules/block');
var markup = require('../../');

function TableCell(align) {
    return markup.Entity(
        markup.INLINES.TABLE_CELL,
        markup.Entity.MUTABLE,
        {
            align: align
        }
    );
}

function TableRow(cells) {
    return markup.Entity(
        markup.INLINES.TABLE_ROW,
        markup.Entity.MUTABLE,
        {}
    );
}

function TableHeader() {
    return markup.Entity(
        markup.INLINES.TABLE_HEADER,
        markup.Entity.MUTABLE,
        {}
    );
}

function TableBody() {
    return markup.Entity(
        markup.INLINES.TABLE_BODY,
        markup.Entity.MUTABLE,
        {}
    );
}

function Table(header, align, rows) {
    var result = '';
    var entityRanges = [];

    function pushEntity(base, text, innerText, entity) {
        var offset = base + text.length;
        text += innerText;

        entityRanges.push(
            markup.Range(offset, innerText.length, {
                entity: entity
            })
        );

        return text;
    }

    // Push a row and return the string
    function pushRow(base, cells) {
        var rowText = cells.reduce(function(text, cell, i) {
            return pushEntity(base, text, cell, TableCell(align[i]));
        }, '');

        return pushEntity(
            base, '', rowText, TableRow()
        );
    }

    result = pushEntity(0, result, pushRow(0, header), TableHeader());


    var tableBody = rows.reduce(function(text, cells) {
        return pushRow(result.length, cells);
    }, '');
    result = pushEntity(result.length, result, tableBody, TableBody());

    return {
        text: result,
        entityRanges: entityRanges
    };
}

var blockRule = markup.Rule(markup.BLOCKS.TABLE)

    // table no leading pipe (gfm)
    .regExp(reBlock.tables.nptable, function(match) {

    })

    // normal table
    .regExp(reBlock.tables.table, function(match) {
        var header =  match[1].replace(/^ *| *\| *$/g, '').split(/ *\| */);
        var align = match[2].replace(/^ *|\| *$/g, '').split(/ *\| */);
        var rows = match[3].replace(/(?: *\| *)?\n$/, '').split('\n').slice(0);

        // Align for columns
        align = align.map(function(s) {
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

        // Split each row into cells
        rows = rows.map(function(row) {
            return row
                .replace(/^ *\| *| *\| *$/g, '')
                .split(/ *\| */);
        });

        return Table(header, align, rows);

    })

    // Output table as text
    .toText(function() {

    });

module.exports = {
    block: blockRule
};
