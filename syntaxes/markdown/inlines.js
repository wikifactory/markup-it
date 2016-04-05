var reInline = require('kramed/lib/rules/inline');
var markup = require('../../');

var utils = require('./utils');
var text = require('./text');

module.exports = [
    // ---- ESCAPED ----
    markup.Rule(markup.STYLES.TEXT)
        .setOption('parseInline', false)
        .regExp(text.reEscape, function(match) {
            return {
                text: utils.unescape(match[0])
            };
        })
        .toText(utils.escape),

    // ---- FOOTNOTE REFS ----
    markup.Rule(markup.ENTITIES.FOOTNOTE_REF)
        .regExp(reInline.reffn, function(match) {
            return {
                mutability: 'MUTABLE',
                text: match[1],
                data: {}
            };
        })
        .toText(function(text) {
            return '[^' + text + ']';
        }),

    // ---- IMAGES ----
    markup.Rule(markup.ENTITIES.IMAGE)
        .regExp(reInline.link, function(match) {
            var isImage = match[0].charAt(0) === '!';
            if (!isImage) return null;

            return {
                mutability: 'IMMUTABLE',
                text: ' ',
                data: {
                    title: match[1],
                    src: match[2]
                }
            };
        })
        .toText(function(text, entity) {
            return '![' + entity.data.title + '](' + entity.data.src + ')';
        }),

    // ---- LINK ----
    markup.Rule(markup.ENTITIES.LINK)
        .regExp(reInline.link, function(match) {
            return {
                mutability: 'MUTABLE',
                text: match[1],
                data: {
                    href: match[2],
                    title: match[3]
                }
            };
        })
        .toText(function(text, entity) {
            var title = entity.data.title? ' "' + entity.data.title + '"' : '';
            return '[' + text + '](' + entity.data.href + title + ')';
        }),

    // ---- REF LINKS ----
    // Doesn't render, but match and resolve reference
    markup.Rule(markup.ENTITIES.LINK_REF)
        .regExp(reInline.reflink, function(match) {
            return {
                mutability: 'MUTABLE',
                text: match[1],
                data: {
                    ref: match[2]
                }
            };
        })
        .finish(function(text, entity) {
            var refs = (this.refs || {});
            var refId = entity.data.ref;
            var ref = refs[refId];

            entity.type = markup.ENTITIES.LINK;
            entity.data = ref || { href: refId };

            return entity;
        })
        .toText(function(text, entity) {
            var title = entity.data.title? ' "' + entity.data.title + '"' : '';
            return '[' + text + '](' + entity.data.href + title + ')';
        }),

    // ---- CODE ----
    markup.Rule(markup.STYLES.CODE)
        .setOption('parseInline', false)
        .regExp(reInline.code, function(match) {
            return {
                text: match[2]
            };
        })
        .toText('`%s`'),

    // ---- BOLD ----
    markup.Rule(markup.STYLES.BOLD)
        .regExp(reInline.strong, function(match) {
            return {
                text: match[2]
            };
        })
        .toText('**%s**'),

    // ---- ITALIC ----
    markup.Rule(markup.STYLES.ITALIC)
        .regExp(reInline.em, function(match) {
            return {
                text: match[1]
            };
        })
        .toText('_%s_'),

    // ---- STRIKETHROUGH ----
    markup.Rule(markup.STYLES.STRIKETHROUGH)
        .regExp(reInline.gfm.del, function(match) {
            return {
                text: match[1]
            };
        })
        .toText('~~%s~~'),

    // ---- HTML ----
    markup.Rule(markup.STYLES.HTML)
        .setOption('parseInline', false)
        .regExp(reInline.html, function(match) {
            return {
                text: match[0]
            };
        })
        .toText('%s'),

    // ---- TEXT ----
    markup.Rule(markup.STYLES.TEXT)
        .setOption('parseInline', false)
        .regExp(text.re, function(match) {
            return {
                text: utils.unescape(match[0])
            };
        })
        .toText(utils.escape)
];
