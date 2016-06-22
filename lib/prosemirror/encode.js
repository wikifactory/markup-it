var Immutable = require('immutable');
var MARK_TYPES = require('./markTypes');

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
 * Encode token as a mark
 * @param {Token} token
 * @return {Object}
 */
function tokenToMark(token) {
    var data = token.getData();

    return data
        .merge({
            '_': token.getType()
        })
        .toJS();
}

/**
 * Encode an inline token
 * @paran {Token} tokens
 * @param {List<Mark>}
 * @return {Array<Object>}
 */
function encodeInlineTokenToJSON(token, marks) {
    marks = marks || Immutable.List();

    if (!MARK_TYPES.includes(token.getType())) {
        return [
            {
                type:  token.getType(),
                text: token.getText(),
                attrs: encodeDataToAttrs(token.getData()),
                marks: marks.toJS()
            }
        ];
    }

    var mark       = tokenToMark(token);
    var innerMarks = marks.push(mark);
    var tokens     = token.getTokens();

    return tokens
        .reduce(function(accu, token) {
            return accu.concat(encodeInlineTokenToJSON(token, innerMarks));
        }, []);
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
