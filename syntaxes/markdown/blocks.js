var reBlock = require('./re/block');
var markup = require('../../');

var heading = require('./heading');
var list = require('./list');
var code = require('./code');
var table = require('./table');
var utils = require('./utils');

module.exports = markup.RulesSet([
    // ---- LISTS ----
    list.ul,
    list.ol,

    // ---- CODE BLOCKS ----
    code.block,

    // ---- TABLE ----
    table.block,

    // ---- HEADING ----
    heading.rule(6),
    heading.rule(5),
    heading.rule(4),
    heading.rule(3),
    heading.rule(2),
    heading.rule(1),

    heading.lrule(2),
    heading.lrule(1),

    // ---- HTML ----
    markup.Rule(markup.BLOCKS.HTML)
        .regExp(reBlock.html, function(match) {
            return {
                text: match[0]
            };
        })
        .toText('%s\n\n'),

    // ---- HR ----
    markup.Rule(markup.BLOCKS.HR)
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

    // ---- DEFINITION ----
    markup.Rule(markup.BLOCKS.DEFINITION)
        .regExp(reBlock.def, function(match) {
            var id = match[1];
            var href = match[2];
            var title = match[3];

            this.refs = this.refs || {};
            this.refs[id] = {
                href: href,
                title: title
            };

            // Don't create block, we just index it
            return {
                text: ''
            };
        })
        .toText(function() {
            return '\n\n';
        }),


    // ---- PARAGRAPH ----
    markup.Rule(markup.BLOCKS.PARAGRAPH)
        .regExp(reBlock.paragraph, function(match) {
            return {
                text: match[1].trim()
            };
        })
        .toText('%s\n\n'),

    // ---- IGNORE
    markup.Rule(markup.BLOCKS.IGNORE)
        .regExp(reBlock.newline)
]);
