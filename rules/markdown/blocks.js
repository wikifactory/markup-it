var rBlock = require('kramed/lib/rules/block');
var BLOCKS = require('../../').BLOCKS;

var utils = require('./utils');
var heading = require('./heading');
var list = require('./list');


module.exports = [
    // ---- CODE BLOCKS ----
    {
        type: BLOCKS.CODE,

        // Disable inline style for code blocks
        parseInline: false,
        renderInline: true,

        toText: function(text) {
            return text + '\n\n';
        },

        // Extract inner of code blocks by removing indentations
        match: function(text) {
            var match, inner, lines;
            var resultText, resultRaw, resultSyntax;

            // Test code blocks with 4 spaces
            match = rBlock.code.exec(text);
            if (match) {
                inner = match[0];
                lines = utils.splitLines(inner);
                inner = lines.map(function(line) {
                    return line.replace(/^( {4}|\t)/, '');
                })
                .join('\n')
                .replace(/\s+$/g, '');

                resultText = inner;
                resultRaw = match[0];
            }

            // Test fences
            match = rBlock.gfm.fences.exec(text);
            if (match) {
                resultText = match[3];
                resultSyntax = match[2];
                resultRaw = match[0];
            }

            if (resultRaw) {
                return {
                    raw: resultRaw,
                    text: resultText,
                    entityRanges: [
                        {
                            offset: 0,
                            length: resultText.length,
                            entity: {
                                mutability: 'MUTABLE',
                                type: BLOCKS.CODE,
                                data: {
                                    syntax: resultSyntax
                                }
                            }
                        }
                    ]
                };
            }

            return null;
        }
    },

    // ---- HEADING ----
    heading.rule(6),
    heading.rule(5),
    heading.rule(4),
    heading.rule(3),
    heading.rule(2),
    heading.rule(1),

    heading.lrule(2),
    heading.lrule(1),

    // ---- HR ----
    {
        type: BLOCKS.HR,
        regexp: rBlock.hr,
        toText: '---\n\n'
    },

    // ---- BLOCKQUOTE ----
    {
        type: BLOCKS.BLOCKQUOTE,
        regexp: rBlock.blockquote,
        props: function(match) {
            return {
                text: match[1].replace(/^ *> ?/gm, '').trim()
            };
        },
        toText: '> %s\n\n'
    },

    // ---- LISTS ----
    list.rule(BLOCKS.UL_ITEM),
    list.rule(BLOCKS.OL_ITEM),

    // ---- FOOTNOTES ----
    {
        type: BLOCKS.FOOTNOTE,
        regexp: rBlock.footnote,
        props: function(match) {
            var text = match[2];

            return {
                text: text,
                entityRanges: [
                    {
                        offset: 0,
                        length: text.length,
                        entity: {
                            mutability: 'MUTABLE',
                            type: BLOCKS.FOOTNOTE,
                            data: {
                                id: match[1]
                            }
                        }
                    }
                ]
            };
        },
        toText: function(text) {
            return text + '\n\n';
        }
    },

    // ---- DEFINITION ----
    {
        type: BLOCKS.DEFINITION,
        regexp: rBlock.def,
        props: function(match) {
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
        },
        toText: function(text) {
            return '';
        }
    },


    // ---- PARAGRAPH ----
    {
        type: BLOCKS.PARAGRAPH,
        regexp: rBlock.paragraph,
        props: function(match) {
            return {
                text: match[1].trim()
            };
        },
        toText: '%s\n\n'
    },

    // ---- IGNORE
    {
        regexp: rBlock.newline,
        type: BLOCKS.IGNORE
    }
];
