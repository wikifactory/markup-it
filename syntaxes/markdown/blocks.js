var reBlock = require('kramed/lib/rules/block');
var markup = require('../../');

var heading = require('./heading');
var list = require('./list');
var code = require('./code');
var table = require('./table');

module.exports = [
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

    // ---- LISTS ----
    list.ul,
    list.ol,

    // ---- HR ----
    markup.Rule(markup.BLOCKS.HR)
        .regExp(reBlock.hr)
        .toText('---\n\n'),

    // ---- BLOCKQUOTE ----
    markup.Rule(markup.BLOCKS.BLOCKQUOTE)
        .regExp(reBlock.blockquote, function(match) {
            return {
                text: match[1].replace(/^ *> ?/gm, '').trim()
            };
        })
        .toText('> %s\n\n'),


    // ---- FOOTNOTES ----
    markup.Rule(markup.BLOCKS.FOOTNOTE)
        .regExp(reBlock.footnote, function(match) {
            var text = match[2];

            return markup.EntityBlock(markup.BLOCKS.FOOTNOTE, text, markup.Entity.MUTABLE, {
                id: match[1]
            });
        })
        .toText('%s\n\n'),

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
        .toText(''),


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
];
