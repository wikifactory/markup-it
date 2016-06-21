var Immutable = require('immutable');

var reInline = require('./re/inline');
var MarkupIt = require('../../');

var utils = require('./utils');
var isHTMLBlock = require('./isHTMLBlock');

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

var inlineRules = MarkupIt.RulesSet([
    // ---- FOOTNOTE REFS ----
    MarkupIt.Rule(MarkupIt.ENTITIES.FOOTNOTE_REF)
        .regExp(reInline.reffn, function(state, match) {
            return {
                text: match[1]
            };
        })
        .toText(function(state, token) {
            return '[^' + token.getText() + ']';
        }),

    // ---- IMAGES ----
    MarkupIt.Rule(MarkupIt.ENTITIES.IMAGE)
        .regExp(reInline.link, function(state, match) {
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
            var alt  = data.get('alt', '');
            var src  = data.get('src', '');

            return '![' + alt + '](' + src + ')';
        }),

    // ---- LINK ----
    MarkupIt.Rule(MarkupIt.ENTITIES.LINK)
        .regExp(reInline.link, function(state, match) {
            return state.toggle('link', function() {
                return {
                    tokens: state.parseAsInline(match[1]),
                    data: {
                        href:  match[2],
                        title: match[3]
                    }
                }
            });
        })
        .regExp(reInline.autolink, function(state, match) {
            return state.toggle('link', function() {
                return {
                    tokens: state.parseAsInline(match[1]),
                    data: {
                        href: match[1]
                    }
                }
            });
        })
        .regExp(reInline.url, function(state, match, parents) {
            if (state.get('link')) {
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
        .regExp(reInline.reflink, function(state, match) {
            var ref = resolveRefLink(state, (match[2] || match[1]));

            if (!ref) {
                return;
            }

            return state.toggle('link', function() {
                return {
                    type: MarkupIt.ENTITIES.LINK,
                    text: match[1],
                    data: ref
                };
            });
        })
        .regExp(reInline.nolink, function(state, match) {
            var ref = resolveRefLink(state, (match[2] || match[1]));

            if (!ref) {
                return;
            }

            return state.toggle('link', function() {
                return {
                    type: MarkupIt.ENTITIES.LINK,
                    tokens: state.parseAsInline(match[1]),
                    data: ref
                };
            });
        })
        .regExp(reInline.reffn, function(state, match) {
            var ref = resolveRefLink(state, match[1]);

            if (!ref) {
                return null;
            }

            return state.toggle('link', function() {
                return {
                    tokens: state.parseAsInline(match[1]),
                    data: ref
                };
            });
        })
        .toText(function(state, token) {
            var data         = token.getData();
            var title        = data.get('title');
            var href         = data.get('href');
            var innerContent = state.renderAsInline(token);
            title            = title? ' "' + title + '"' : '';

            return '[' + innerContent + '](' + href + title + ')';
        }),

    // ---- CODE ----
    MarkupIt.Rule(MarkupIt.STYLES.CODE)
        .regExp(reInline.code, function(state, match) {
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
    MarkupIt.Rule(MarkupIt.STYLES.BOLD)
        .regExp(reInline.strong, function(state, match) {
            return {
                tokens: state.parseAsInline(match[2] || match[1])
            };
        })
        .toText('**%s**'),

    // ---- ITALIC ----
    MarkupIt.Rule(MarkupIt.STYLES.ITALIC)
        .regExp(reInline.em, function(state, match) {
            return {
                tokens: state.parseAsInline(match[2] || match[1])
            };
        })
        .toText('_%s_'),

    // ---- STRIKETHROUGH ----
    MarkupIt.Rule(MarkupIt.STYLES.STRIKETHROUGH)
        .regExp(reInline.del, function(state, match) {
            return {
                text: state.parseAsInline(match[1])
            };
        })
        .toText('~~%s~~'),

    // ---- HTML ----
    MarkupIt.Rule(MarkupIt.STYLES.HTML)
        .regExp(reInline.html, function(state, match) {
            var tag       = match[0];
            var tagName   = match[1];
            var innerText = match[2] || '';
            var startTag, endTag;
            var innerTokens = [];

            if (innerText) {
                startTag = tag.substring(0, tag.indexOf(innerText));
                endTag   = tag.substring(tag.indexOf(innerText) + innerText.length);
            } else {
                startTag = match[0];
                endTag   = '';
            }

            if (tagName && !isHTMLBlock(tagName) && innerText) {
                var isLink = (tagName.toLowerCase() === 'a');

                innerTokens = state.toggle(isLink? 'link' : 'html', function() {
                    return state.parseAsInline(innerText);
                });
            } else {
                innerTokens = [
                    {
                        type: MarkupIt.STYLES.HTML,
                        text: innerText,
                        raw: innerText
                    }
                ];
            }

            var result = Immutable.List()
                .push({
                    type: MarkupIt.STYLES.HTML,
                    text: startTag,
                    raw: startTag
                });

            result = result.concat(innerTokens);

            if (endTag) {
                result = result.push({
                    type: MarkupIt.STYLES.HTML,
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
    MarkupIt.Rule(MarkupIt.STYLES.TEXT)
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
