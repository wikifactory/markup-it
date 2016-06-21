var reInline = require('./re/inline');
var markup = require('../../');

var utils = require('./utils');
var isHTMLBlock = require('./isHTMLBlock');

/**
 * Test if we are parsing inside a link
 * @param {List<Token>} parents
 * @return {Boolean}
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
 * Resolve a reflink
 * @param {Object} ctx
 * @param {String} text
 * @return {Object|null}
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
        .toText(function(state, token) {
            return '[^' + token.getText() + ']';
        }),

    // ---- IMAGES ----
    markup.Rule(markup.ENTITIES.IMAGE)
        .regExp(reInline.link, function(match) {
            var isImage = match[0].charAt(0) === '!';
            if (!isImage) {
                return;
            }

            return {
                data: {
                    alt: match[1],
                    src: match[2]
                }
            };
        })
        .toText(function(state, token) {
            var data = token.getData();
            return '![' + data.alt + '](' + data.src + ')';
        }),

    // ---- LINK ----
    markup.Rule(markup.ENTITIES.LINK)
        .regExp(reInline.link, function(state, match) {
            return {
                tokens: state.parseAsInline(match[1]),
                data: {
                    href: match[2],
                    title: match[3]
                }
            };
        })
        .regExp(reInline.autolink, function(state, match) {
            return {
                tokens: state.parseAsInline(match[1]),
                data: {
                    href: match[1]
                }
            };
        })
        .regExp(reInline.url, function(state, match, parents) {
            if (isInLink(parents, this)) {
                return;
            }

            var uri = match[1];

            return {
                tokens: state.parseAsInline(uri),
                data: {
                    href: uri
                }
            };
        })
        .regExp(reInline.reflink, function(state, match) {
            var ref = resolveRefLink(state, (match[2] || match[1]));

            if (!ref) {
                return;
            }

            return {
                type: markup.ENTITIES.LINK,
                text: match[1],
                data: ref
            };
        })
        .regExp(reInline.nolink, function(state, match) {
            var ref = resolveRefLink(state, (match[2] || match[1]));

            if (!ref) {
                return;
            }

            return {
                type: markup.ENTITIES.LINK,
                tokens: state.parseAsInline(match[1]),
                data: ref
            };
        })
        .regExp(reInline.reffn, function(state, match) {
            var ref = resolveRefLink(state, match[1]);

            if (!ref) {
                return null;
            }

            return {
                tokens: state.parseAsInline(match[1]),
                data: ref
            };
        })
        .toText(function(state, token) {
            var data         = token.getData();
            var title        = data.title? ' "' + data.title + '"' : '';
            var innerContent = state.renderAsInline(token);

            return '[' + innerContent + '](' + data.href + title + ')';
        }),

    // ---- CODE ----
    markup.Rule(markup.STYLES.CODE)
        .regExp(reInline.code, function(match) {
            return {
                text: match[2]
            };
        })
        .toText(function(state, token) {
            var separator = '`';
            var text = token.getText();

            // We need to find the right separator not present in the content
            while (text.indexOf(separator) >= 0) {
                separator += '`';
            }

            return (separator + text + separator);
        }),

    // ---- BOLD ----
    markup.Rule(markup.STYLES.BOLD)
        .regExp(reInline.strong, function(state, match) {
            return {
                tokens: state.parseAsInline(match[2] || match[1])
            };
        })
        .toText('**%s**'),

    // ---- ITALIC ----
    markup.Rule(markup.STYLES.ITALIC)
        .regExp(reInline.em, function(state, match) {
            return {
                tokens: state.parseAsInline(match[2] || match[1])
            };
        })
        .toText('_%s_'),

    // ---- STRIKETHROUGH ----
    markup.Rule(markup.STYLES.STRIKETHROUGH)
        .regExp(reInline.del, function(state, match) {
            return {
                text: state.parseAsInline(match[1])
            };
        })
        .toText('~~%s~~'),

    // ---- HTML ----
    markup.Rule(markup.STYLES.HTML)
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
        .toText(function(state, token) {
            return token.getText();
        }),

    // ---- ESCAPED ----
    markup.Rule(markup.STYLES.TEXT)
        .regExp(reInline.escape, function(state, match) {
            return {
                text: match[1]
            };
        })
        .regExp(reInline.text, function(state, match) {
            return {
                text: utils.unescape(match[0])
            };
        })
        .toText(function(state, token) {
            var text = token.getText();
            return utils.escape(text, false);
        })
]);

module.exports = inlineRules;
