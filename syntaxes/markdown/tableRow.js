var markup = require('../../');

var reTable = require('./re/table');
var inlineRules = require('./inline');
var utils = require('./utils');

var CELL_SEPARATOR = 'cell';

/*
    Custom inline syntax to parse each row with custom cell separator tokens
*/
var rowRules = inlineRules
    .unshift(
        markup.Rule(CELL_SEPARATOR)
            .setOption('parseInline', false)
            .regExp(reTable.cellSeparation, function(match) {
                return {
                    text: match[0]
                };
            })
    )
    .replace(
        markup.Rule(markup.STYLES.TEXT)
            .setOption('parseInline', false)
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

var rowSyntax = markup.Syntax('markdown+row', {
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
    var content = markup.parseInline(rowSyntax, text, ctx);
    var tokens = content.getTokens();

    function pushCell() {
        if (accu.length > 0) {
            groups.push({
                content: markup.Content.createFromTokens(
                    content.getSyntax(),
                    accu
                )
            });
        }
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

module.exports = {
    parse: parseRow
};
