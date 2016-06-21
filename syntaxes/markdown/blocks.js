var reBlock = require('./re/block');
var markup = require('../../');

var heading = require('./heading');
var list = require('./list');
var code = require('./code');
var table = require('./table');
var utils = require('./utils');

/**
 * Is top block check that a paragraph can be parsed
 * Paragraphs can exists only in loose list or blockquote.
 *
 * @param {List<Token>} parents
 * @return {Boolean}
 */
function isTop(parents) {
    return parents.find(function(token) {
        var isBlockquote = (token.getType() === markup.BLOCKS.BLOCKQUOTE);
        var isLooseList = (token.isListItem() && token.getData().get('loose'));

        return (!isBlockquote && !isLooseList);
    }) === undefined;
}

module.exports = markup.RulesSet([
    // ---- CODE BLOCKS ----
    code.block,

    // ---- FOOTNOTES ----
    markup.Rule(markup.BLOCKS.FOOTNOTE)
        .regExp(reBlock.footnote, function(state, match) {
            var text = match[2];

            return {
                tokens: state.parseAsInline(text),
                data: {
                    id: match[1]
                }
            };
        })
        .toText(function(state, token) {
            var data = token.getData();
            var innerContent = state.renderAsInline(token);

            return '[^' + data.id + ']: ' + innerContent + '\n\n';
        }),

    // ---- HEADING ----
    heading(6),
    heading(5),
    heading(4),
    heading(3),
    heading(2),
    heading(1),

    // ---- TABLE ----
    table.block,
    table.header,
    table.body,
    table.row,
    table.cell,

    // ---- HR ----
    markup.Rule(markup.BLOCKS.HR)
        .regExp(reBlock.hr, function() {
            return {};
        })
        .toText('---\n\n'),

    // ---- BLOCKQUOTE ----
    markup.Rule(markup.BLOCKS.BLOCKQUOTE)
        .regExp(reBlock.blockquote, function(state, match) {
            var inner = match[0].replace(/^ *> ?/gm, '').trim();

            return {
                tokens: state.parseAsBlock(inner)
            };
        })

        .toText(function(state, token) {
            var innerContent = state.renderAsBlock(token);
            var lines = utils.splitLines(innerContent.trim());

            return lines
                .map(function(line) {
                    return '> ' + line;
                })
                .join('\n') + '\n\n';
        }),

    // ---- LISTS ----
    list.ul,
    list.ol,

    // ---- HTML ----
    markup.Rule(markup.BLOCKS.HTML)
        .regExp(reBlock.html, function(match) {
            return {
                text: match[0]
            };
        })
        .toText('%s'),

    // ---- DEFINITION ----
    markup.Rule()
        .regExp(reBlock.def, function(match, parents) {
            if (parents.size > 0) {
                return null;
            }

            var id = match[1].toLowerCase();
            var href = match[2];
            var title = match[3];

            this.refs = this.refs || {};
            this.refs[id] = {
                href: href,
                title: title
            };

            return {
                type: markup.BLOCKS.IGNORE
            };
        }),

    // ---- PARAGRAPH ----
    markup.Rule(markup.BLOCKS.PARAGRAPH)
        .regExp(reBlock.paragraph, function(state, match) {
            if (!isTop(parents)) {
                return;
            }
            var text = match[1].trim();

            return {
                tokens: state.parseAsInline(text)
            };
        })
        .toText('%s\n\n'),

    // ---- TEXT ----
    // Top-level should never reach here.
    markup.Rule(markup.BLOCKS.TEXT)
        .regExp(reBlock.text, function(state, match) {
            var text = match[0];

            return {
                tokens: state.parseAsInline(text)
            };
        })
        .toText('%s\n')
]);
