var reInline = require('./re/inline');
var markup = require('../../');

var utils = require('./utils');

var inlineRules = markup.RulesSet([
    // ---- FOOTNOTE REFS ----
    markup.Rule(markup.ENTITIES.FOOTNOTE_REF)
        .regExp(reInline.reffn, function(match) {
            return {
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
            var refs = (this.refs || {});
            var refId = match[2].toLowerCase();
            var ref = refs[refId];

            if (!ref) {
                return null;
            }

            return {
                type: markup.ENTITIES.LINK,
                text: match[1],
                data: ref
            };
        })
        .regExp(reInline.nolink, function(match) {
            var refs = (this.refs || {});
            var refId = match[1].toLowerCase();
            var ref = refs[refId];

            if (!ref) {
                return null;
            }

            return {
                type: markup.ENTITIES.LINK,
                text: match[1],
                data: ref
            };
        })
        .regExp(reInline.reffn, function(match) {
            var refs = (this.refs || {});
            var refId = match[1].toLowerCase();
            var ref = refs[refId];

            if (!ref) {
                return null;
            }

            return {
                text: match[1],
                data: ref
            };
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
                text: match[2] || match[1]
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
        .regExp(reInline.html, function(match, parents) {
            var tag = match[0];
            var tagName = match[1];
            var innerText = match[2];
            var isInLink = parents.find(function(tok) {
                return tok.getType() === markup.ENTITIES.LINK;
            }) !== undefined;

            var startTag = tag.substring(0, tag.indexOf(innerText));
            var endTag = tag.substring(tag.indexOf(innerText) + innerText.length);


            if (tagName === 'a' && innerText) {

            }

            var inlineSyntax = markup.Syntax('markdown+html', {
                inline: inlineRules
            });
            var content = markup.parseInline(inlineSyntax, innerText, this);
            var tokens = content.getTokens();

            return {
                text: innerText,
                data: {
                    start: startTag,
                    end: endTag
                },
                tokens: tokens
            };
        })
        .toText(function(text, token) {
            return token.data.start + text + token.data.end;
        }),

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

module.exports = inlineRules;
