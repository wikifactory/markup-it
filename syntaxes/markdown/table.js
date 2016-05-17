var reTable = require('./re/table');
var markup = require('../../');

var tableRow = require('./tableRow');

// Create a table entity

/**
    Create a table entity from parsed header/rows

    @param {Array} header
    @param {Array<String>} align
    @param {Array<Array>} rows
    @rteturn {Object} tokenMatch
*/
function Table(header, align, rows) {
    var ctx = this;

    var headerRow = tableRow.parse(header, ctx, align);
    var rowTokens = rows.map(function(row) {
        return tableRow.parse(row, ctx, align);
    });

    var headerToken = markup.Token.create(markup.BLOCKS.TABLE_HEADER, {
        tokens: [headerRow],
        data: {
            align: align
        }
    });

    var bodyToken = markup.Token.create(markup.BLOCKS.TABLE_BODY, {
        tokens: rowTokens,
        data: {
            align: align
        }
    });

    return {
        data: {
            align: align
        },
        tokens: [
            headerToken,
            bodyToken
        ]
    };
}

/**
    Detect alignement per column

    @param {Array<String>}
    @return {Array<String|null>}
*/
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

/**
    Render align to text

    @param {Array<String>} row
    @return {String}
*/
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

    // Table no leading pipe (gfm)
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

    // Normal table
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

    .toText(function(text) {
        return text;
    });

var headerRule = markup.Rule(markup.BLOCKS.TABLE_HEADER)
    .toText(function(text, tok) {
        return text + alignToText(tok.data.align) + '\n';
    });

var bodyRule = markup.Rule(markup.BLOCKS.TABLE_BODY)
    .toText(function(text) {
        return text;
    });

var rowRule = markup.Rule(markup.BLOCKS.TABLE_ROW)
    .toText(function(text) {
        return '|' + text + '\n';
    });

var cellRule = markup.Rule(markup.BLOCKS.TABLE_CELL)
    .toText(function(text) {
        return ' ' + text + ' |';
    });

module.exports = {
    block:  blockRule,
    header: headerRule,
    body:   bodyRule,
    cell:   cellRule,
    row:    rowRule
};
