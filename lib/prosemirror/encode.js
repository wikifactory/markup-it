var Immutable = require('immutable');
var Range = require('range-utils');

var STYLES = require('../constants/styles');
var walk = require('../utils/walk');

var MARK_TYPES = Immutable.List([
    STYLES.BOLD,
    STYLES.ITALIC,
    STYLES.CODE,
    STYLES.STRIKETHROUGH
]);

/**
 * Encode data of a token, it ignores undefined value
 *
 * @paran {Map} data
 * @return {Object}
 */
function encodeDataToAttrs(data) {
    return data
        .filter(function(value, key) {
            return (value !== undefined);
        })
        .toJS();
}

/**
 * Encode an inline token
 * @paran {Token} tokens
 * @return {Array<Object>}
 */
function encodeInlineTokenToJSON(token) {
    var ranges = [];

    var innerText = walk(token, function(tok, range) {
        ranges.push(
            Range(
                range.offset,
                range.length,
                {
                    tokens: [tok]
                }
            )
        );
    });

    ranges = Range.merge(ranges, function(a, b) {
        return Range(a.offset, a.length, {
            tokens: a.tokens.concat(b.tokens)
        });
    });

    return ranges.map(function(range) {
        var marks = Immutable.List(range.tokens)
            .map(function(tok) {
                return tok.getType();
            })
            .toSet()
            .add(token.getType())
            .delete(STYLES.TEXT);

        return {
            type: STYLES.TEXT,
            marks: marks,
            text: innerText.slice(range.offset, range.offset + range.length)
        };
    });
}

/**
 * Encode a block token
 * @paran {Token} tokens
 * @return {Object}
 */
function encodeBlockTokenToJSON(token) {
    return {
        type:    token.getType(),
        attrs:   encodeDataToAttrs(token.getData()),
        content: encodeTokensToJSON(token.getTokens())
    };
}

/**
 * Encode a token to JSON
 *
 * @paran {Token} tokens
 * @return {Array<Object>}
 */
function encodeTokenToJSON(token) {
    if (token.isInline()) {
        return encodeInlineTokenToJSON(token);
    } else {
        return [encodeBlockTokenToJSON(token)];
    }
}

/**
 * Encode a list of tokens to JSON
 *
 * @paran {List<Token>} tokens
 * @return {Array<Object>}
 */
function encodeTokensToJSON(tokens) {
    return tokens.reduce(function(accu, token) {
        return accu.concat(encodeTokenToJSON(token));
    }, []);
}

/**
 * Encode a Content into a ProseMirror JSON object
 *
 * @paran {Content} content
 * @return {Object}
 */
function encodeContentToProseMirror(content) {
    return encodeTokenToJSON(content.getToken())[0];
}

module.exports = encodeContentToProseMirror;
