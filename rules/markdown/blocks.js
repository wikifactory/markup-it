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
        inline: false,

        // Add indentation to content
        toText: function(text, entity) {
            var lines = utils.splitLines(text);

            return lines.map(function(line) {
                if (!line.trim()) return '';
                return '    ' + line;
            }).join('\n') + '\n\n';
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


    // ---- PARAGRAPH ----
    {
        regexp: rBlock.paragraph,
        type: BLOCKS.PARAGRAPH,

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
