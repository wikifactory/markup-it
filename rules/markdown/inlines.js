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
        props: function(match) {
            return {
                text: utils.unescape(match[0])
            };
        },
        toText: function(text) {
            return utils.escape(text)
        }
    },

    // ---- FOOTNOTE ----
    // Footnotes are parsed as block with an inner entity
    // this rule defines the toText of the inner entity
    {
        type: BLOCKS.FOOTNOTE,
        match: function() { return null; },
        toText: function(text, entity) {
            return '[^' + entity.data.id + ']: ' + text;
        }
    }

];
