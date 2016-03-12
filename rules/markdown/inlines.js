var rInline = require('kramed/lib/rules/inline');
var rBlock = require('kramed/lib/rules/block');
var INLINES = require('../../').INLINES;
var BLOCKS = require('../../').BLOCKS;

var utils = require('./utils');

module.exports = [
    // ---- ESCAPED ----
    {
        type: INLINES.TEXT,
        regexp: rInline.escape,
        toText: '%s'
    },

    // ---- FOOTNOTE REFS ----
    {
        type: INLINES.FOOTNOTE_REF,
        regexp: rInline.reffn,
        props: function(match) {
            return {
                mutability: 'MUTABLE',
                text: match[1],
                data: {}
            };
        },
        toText: function(text) {
            return '[^' + text + ']';
        }
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

    // ---- LINK----
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

    // ---- REF LINKS ----
    // Doesn't render, but match and resolve reference
    {
        type: INLINES.LINK_REF,
        regexp: rInline.reflink,
        props: function(match) {
            return {
                mutability: 'MUTABLE',
                text: match[1],
                data: {
                    ref: match[2]
                }
            };
        },

        // On post-process, update the link with the url referenced
        post: function(text, entity) {
            var refs = (this.refs || {});
            var refId = entity.data.ref;
            var ref = refs[refId];

            entity.type = INLINES.LINK;
            entity.data = ref || { href: refId };

            return entity;
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
        props: function(match) {
            return {
                text: utils.unescape(match[0])
            };
        },
        toText: function(text) {
            return utils.escape(text);
        }
    },

    // ---- BLOCK ENTITIES ----
    // Footnotes and defs are parsed as block with an inner entity
    // these rules define the toText of the inner entities
    {
        type: BLOCKS.FOOTNOTE,
        match: function() { return null; },
        toText: function(text, entity) {
            return '[^' + entity.data.id + ']: ' + text;
        }
    },
    {
        type: BLOCKS.DEFINITION,
        match: function() { return null; },
        toText: function(text, entity) {
            var title = entity.data.title? ' ' + JSON.stringify(entity.data.title) : '';
            return '[' + entity.data.id + ']: ' + text + title;
        }
    },

    // ---- CODE BLOCKS ----
    {
        type: BLOCKS.CODE,
        toText: function(text, entity) {
            // Use fences if syntax is set
            if (entity.data.syntax) {
                return '```' + entity.data.syntax + '\n' + text + '\n```';
            }

            // Use four spaces otherwise
            var lines = utils.splitLines(text);

            return lines.map(function(line) {
                if (!line.trim()) return '';
                return '    ' + line;
            }).join('\n');
        }
    }

];
