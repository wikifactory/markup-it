var INLINES = require('../').INLINES;
var BLOCKS = require('../').BLOCKS;

function splitLines(text) {
    return text.match(/[^\r\n]+/g);
}

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
            regexp: /^( *[-*_]){3,} *(?:\n|$)/,
            toText: '---'
        },


        // ---- HEADING ----
        headingRule(6),
        headingRule(5),
        headingRule(4),
        headingRule(3),
        headingRule(2),
        headingRule(1),


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
            regexp: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
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
            regexp: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
            props: function(match) {
                return {
                    text: match[1]
                };
            },
            toText: '_%s_'
        },

        // ---- TEXT ----
        {
            type: INLINES.TEXT,
            regexp: /^[\s\S]+?(?=[\\<!\[_*`$]| {2,}\n|$)/,
            toText: '%s'
        }

    ]
};
