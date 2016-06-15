var reInline = require('./re/inline');
var markup = require('../../');

var utils = require('./utils');
var isHTMLBlock = require('./isHTMLBlock');

/**
    Test if we are parsing inside a link

    @param {List<Token>} parents
    @return {Boolean}
*/
function isInLink(parents, ctx) {
    if (ctx.isLink) {
        return true;
    }

    return parents.find(function(tok) {
        if (tok.getType() === markup.ENTITIES.LINK) {
            return true;
        }

        return false;
    }) !== undefined;
}

/**
    Resolve a reflink

    @param {Object} ctx
    @param {String} text
    @return {Object|null}
*/
function resolveRefLink(ctx, text) {
    var refs = (ctx.refs || {});

    // Normalize the refId
    var refId = (text)
        .replace(/\s+/g, ' ')
        .toLowerCase();
    var ref = refs[refId];

    return (ref && ref.href)? ref : null;
}

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
                text: ' ',
                data: {
                    alt: match[1],
                    src: match[2]
                }
            };
        })
        .toText(function(text, entity) {
            return '![' + entity.data.alt + '](' + entity.data.src + ')';
        }),

    // ---- LINK ----
    markup.Rule(markup.ENTITIES.LINK)
        .regExp(reInline.link, function(match) {
            return {
                text: match[1],
                data: {
                    href: match[2],
                    title: match[3]
                }
            };
        })
        .regExp(reInline.autolink, function(match) {
            return {
                text: match[1],
                data: {
                    href: match[1]
                }
            };
        })
        .regExp(reInline.url, function(match, parents) {
            if (isInLink(parents, this)) {
                return;
            }

            var uri = match[1];

            return {
                text: uri,
                data: {
                    href: uri
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
            var ref = resolveRefLink(this, (match[2] || match[1]));

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
            var ref = resolveRefLink(this, (match[2] || match[1]));

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
            var ref = resolveRefLink(this, match[1]);

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
                text: match[2] || match[1]
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
        .setOption('renderInline', false)
        .regExp(reInline.html, function(match, parents) {
            var tag = match[0];
            var tagName = match[1];
            var innerText = match[2] || '';

            var startTag, endTag;

            if (innerText) {
                startTag = tag.substring(0, tag.indexOf(innerText));
                endTag = tag.substring(tag.indexOf(innerText) + innerText.length);
            } else {
                startTag = match[0];
                endTag = '';
            }


            // todo: handle link tags
            /*if (tagName === 'a' && innerText) {

            }*/

            var innerTokens = [];

            if (tagName && !isHTMLBlock(tagName) && innerText) {
                var inlineSyntax = markup.Syntax('markdown+html', {
                    inline: inlineRules
                });
                var oldIsLink = this.isLink;
                this.isLink = this.isLink || (tagName.toLowerCase() === 'a');
                innerTokens = markup.parseInline(inlineSyntax, innerText, this)
                    .getTokens()
                    .toArray();
                this.isLink = oldIsLink;
            } else {
                innerTokens = [
                    {
                        type: markup.STYLES.HTML,
                        text: innerText,
                        raw: innerText
                    }
                ];
            }

            var result = [];

            result.push({
                type: markup.STYLES.HTML,
                text: startTag,
                raw: startTag
            });

            result = result.concat(innerTokens);

            if (endTag) {
                result.push({
                    type: markup.STYLES.HTML,
                    text: endTag,
                    raw: endTag
                });
            }

            return result;
        })
        .toText(function(text, token) {
            return text;
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
        .toText(function(text) {
            return utils.escape(text, false);
        })
]);

module.exports = inlineRules;
