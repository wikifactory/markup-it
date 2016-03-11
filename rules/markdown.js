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

// Rule for lists, rBlock.list match the whole (multilines) list, we stop at the first item
console.log(rBlock._item)
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
            console.log(item);

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
                })
                .join('\n')
                .replace(/\s+$/g, '');

                return {
                    text: text
                };
            }
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

        // ---- LISTS ----
        listRule(BLOCKS.UL_ITEM),
        listRule(BLOCKS.OL_ITEM),


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
        // ---- HR ----
        // Parsed as inline entities instead of blocks
        {
            type: BLOCKS.HR,
            regexp: rBlock.hr,
            props: function(match) {
                return {
                    mutability: 'IMMUTABLE',
                    text: ' ',
                    data: {}
                };
            },
            toText: '---'
        },

        // ---- IMAGES ----
        {
            type: INLINES.IMAGE,
            regexp: rInline.link,
            props: function(match) {
                var isImage = match[0].charAt(0) === '!';
                if (!isImage) return null;

                return {
                    mutability: 'IMMUTABLE',
                    text: match[1],
                    data: {
                        title: match[1],
                        src: match[2]
                    }
                };
            },
            toText: function(text, entity) {
                return '![' + text + '](' + entity.data.src + ')';
            }
        },

        // ---- LINK / IMAGES----
        {
            type: INLINES.LINK,
            regexp: rInline.link,
            props: function(match) {
                return {
                    mutability: 'MUTABLE',
                    text: match[1],
                    data: {
                        href: match[2]
                    }
                };
            },
            toText: function(text, entity) {
                return '[' + text + '](' + entity.data.href + ')';
            }
        },

        // ---- CODE ----
        {
            type: INLINES.CODE,
            regexp: rInline.code,
            props: function(match) {
                return {
                    text: match[2]
                };
            },
            toText: '`%s`'
        },


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
            props: function(match) {
                return {
                    text: match[1]
                };
            },
            toText: '~~%s~~'
        },

        // ---- TEXT ----
        {
            type: INLINES.TEXT,
            regexp: rInline.gfm.text,
            toText: '%s'
        }
    ]
};
