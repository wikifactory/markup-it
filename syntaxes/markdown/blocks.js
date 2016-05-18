var reBlock = require('./re/block');
var markup = require('../../');

var heading = require('./heading');
var list = require('./list');
var code = require('./code');
var table = require('./table');
var utils = require('./utils');

module.exports = markup.RulesSet([
    // ---- IGNORE
    markup.Rule(markup.BLOCKS.IGNORE)
        .regExp(reBlock.newline),

    // ---- CODE BLOCKS ----
    code.block,

    // ---- FOOTNOTES ----
    markup.Rule(markup.BLOCKS.FOOTNOTE)
        .regExp(reBlock.footnote, function(match) {
            var text = match[2];

            return {
                text: text,
                data: {
                    id: match[1]
                }
            };
        })
        .toText(function(text, block) {
            return '[^' + block.data.id + ']: ' + text + '\n\n';
        }),

    // ---- HEADING ----
    heading.rule(6),
    heading.rule(5),
    heading.rule(4),
    heading.rule(3),
    heading.rule(2),
    heading.rule(1),

    heading.lrule(2),
    heading.lrule(1),

    // ---- TABLE ----
    table.block,
    table.header,
    table.body,
    table.row,
    table.cell,

    // ---- HR ----
    markup.Rule(markup.BLOCKS.HR)
        .setOption('parse', false)
        .setOption('renderInner', false)
        .regExp(reBlock.hr)
        .toText('---\n\n'),

    // ---- BLOCKQUOTE ----
    markup.Rule(markup.BLOCKS.BLOCKQUOTE)
        .setOption('parse', 'block')
        .regExp(reBlock.blockquote, function(match) {
            var inner = match[1].replace(/^ *> ?/gm, '').trim();

            return {
                text: inner
            };
        })

        .toText(function(text) {
            var lines = utils.splitLines(text);

            return lines
            .map(function(line) {
                // todo: can be improved to avoid empty line at the end
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
        .toText('%s\n\n'),

    // ---- DEFINITION ----
    markup.Rule(markup.BLOCKS.DEFINITION)
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
        .regExp(reBlock.paragraph, function(match) {
            var text = match[1];

            return {
                text: text.charAt(text.length - 1) === '\n'
                ? text.slice(0, -1)
                : text.trim()
            };
        })
        .toText('%s\n\n')
]);
