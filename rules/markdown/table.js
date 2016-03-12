var reBlock = require('kramed/lib/rules/block');
var markup = require('../../');

var blockRule = markup.Rule(markup.BLOCKS.TABLE)

    // table no leading pipe (gfm)
    .regExp(reBlock.tables.nptable, function(match) {

    })

    // normal table
    .regExp(reBlock.tables.table, function(match) {

    })

    // Output table as text
    .toText(function() {

    });

module.exports = {
    block: blockRule
};
