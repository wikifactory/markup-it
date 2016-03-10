var INLINES = require('../').INLINES;
var BLOCKS = require('../').BLOCKS;

var rBlock = require('kramed/lib/rules/block');
var rInline = require('kramed/lib/rules/inline');

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

module.exports = {
    blocks: [
        {
            type: BLOCKS.CODE,
            regexp: /^((?: {4}|\t)[^\n]+\n*)+/,

            // Disable inline style for code blocks
            inline: false,

            // Add indentation to content
            toText: function(text) {
                var lines = splitLines(text);

                return lines.map(function(line) {
                    return '    ' + line;
                }).join('\n') + '\n\n';
            },

            // Extract inner of code blocks by removing indentations
            props: function(match) {
                var inner = match[0];
                var lines = splitLines(inner);
                var text = lines.map(function(line) {
                    return line.replace(/^( {4}|\t)/, '');
                }).join('\n')

                return {
                    text: text
                };
            }
        },

        // ---- HR ----
        {
            type: BLOCKS.HR,
            regexp: rBlock.hr,
            toText: '---'
        },


        // ---- HEADING ----
        headingRule(6),
        headingRule(5),
        headingRule(4),
        headingRule(3),
        headingRule(2),
        headingRule(1),

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


        // ---- PARAGRAPH ----
        {
            regexp: /^\n*((?:[^\n]+\n?))\n*/,
            type: BLOCKS.PARAGRAPH,

            props: function(match) {
                return {
                    text: match[1].trim()
                };
            },

            toText: '%s\n\n'
        }
    ],
    inlines: [
        // ---- BOLD ----
        {
            type: INLINES.BOLD,
            regexp: rInline.strong,
            props: function(match) {
                return {
                    text: match[2]
                };
            },
            toText: '**%s**'
        },

        // ---- ITALIC ----
        {
            type: INLINES.ITALIC,
            regexp: rInline.em,
            props: function(match) {
                return {
                    text: match[1]
                };
            },
            toText: '_%s_'
        },

        // ---- STRIKETHROUGH ----
        {
            type: INLINES.STRIKETHROUGH,
            regexp: rInline.gfm.del,
            toText: '~~%s~~'
        },

        // ---- TEXT ----
        {
            type: INLINES.TEXT,
            regexp: /^[\s\S]+?(?=[\\<!\[_*`$]| {2,}\n|$)/,
            toText: '%s'
        }
    ]
};
