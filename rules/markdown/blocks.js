var rBlock = require('kramed/lib/rules/block');
var BLOCKS = require('../../').BLOCKS;

// Split a text into lines
function splitLines(text) {
    return text.split(/\r?\n/);
}

// Generator for HEADING_X rules
function headingRule(level) {
    var prefix = Array(level + 1).join('#');

    return {
        type: BLOCKS['HEADING_' + level],
        regexp: new RegExp('^ *(#{' + level + '}) *([^\n]+?) *#* *(?:\n|$)'),

        props: function(match) {
            return {
                text: match[2]
            };
        },

        toText: function (text, block) {
            return prefix + ' ' + text + '\n\n';
        }
    }
}

// Rule for lists, rBlock.list match the whole (multilines) list, we stop at the first item
function listRule(type) {
    return {
        type: type,
        regexp: rBlock.list,
        props: function(match) {
            var bull = match[1];
            var ordered = bull.length > 1;

            if (ordered && type == BLOCKS.UL_ITEM) return;
            if (!ordered && type == BLOCKS.OL_ITEM) return;


            var item = match[0].match(/^( *)((?:[*+-]|\d+\.)) [^\n]*(?:\n(?!(?:[*+-]|\d+\.) ))*/);

            var text = item[0];

            // Remove the bullet
            text = text.replace(/^ *([*+-]|\d+\.) +/, '');

            return {
                raw: item[0],
                text: text
            };
        },
        toText: '* %s'
    };
}

module.exports = [
    // ---- CODE BLOCKS ----
    {
        type: BLOCKS.CODE,

        // Disable inline style for code blocks
        inline: false,

        // Add indentation to content
        toText: function(text, entity) {
            var lines = splitLines(text);

            return lines.map(function(line) {
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
                lines = splitLines(inner);
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
    headingRule(6),
    headingRule(5),
    headingRule(4),
    headingRule(3),
    headingRule(2),
    headingRule(1),

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
    listRule(BLOCKS.UL_ITEM),
    listRule(BLOCKS.OL_ITEM),


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
