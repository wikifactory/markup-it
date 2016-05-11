var reInline = require('./re/inline');
var markup = require('../../');

var utils = require('./utils');

module.exports = markup.RulesSet([
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
        .regExp(reInline.autolink, function(match) {
            return {
                mutability: 'MUTABLE',
                text: match[1],
                data: {
                    href: match[1]
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
                text: match[1],
                data: {
                    ref: match[2]
                }
            };
        })
        .finish(function(token) {
            var refs = (this.refs || {});
            var refId = token.data.ref;
            var ref = refs[refId];

            token.type = markup.ENTITIES.LINK;
            token.data = ref || { href: refId };

            return token;
        })
        .toText(function(text, entity) {
            var title = entity.data.title? ' "' + entity.data.title + '"' : '';
            return '[' + text + '](' + entity.data.href + title + ')';
        }),

    // ---- CODE ----
    markup.Rule(markup.STYLES.CODE)
        .setOption('parse', false)
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
        .regExp(reInline.del, function(match) {
            return {
                text: match[1]
            };
        })
        .toText('~~%s~~'),

    // ---- HTML ----
    markup.Rule(markup.STYLES.HTML)
        .setOption('parse', false)
        .regExp(reInline.html, function(match) {
            return {
                text: match[0]
            };
        })
        .toText('%s'),

    // ---- ESCAPED ----
    markup.Rule(markup.STYLES.TEXT)
        .setOption('parse', false)
        .regExp(reInline.escape, function(match) {
            return {
                text: match[1]
            };
        })
        .regExp(reInline.text, function(match) {
            return {
                text: utils.unescape(match[0])
            };
        })
        .toText(utils.escape)
]);
