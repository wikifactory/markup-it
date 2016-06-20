var getNodeType = require('./getNodeType');
var getMarkType = require('./getMarkType');

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
 * Encode a token to JSON
 *
 * @paran {Token} tokens
 * @return {Object}
 */
function encodeTokenToJSON(token) {
    var type = token.getType();
    var tokens = token.getTokens();

    var nodeType = getNodeType(type);
    if (nodeType) {
        return {
            type:    nodeType,
            attrs:   encodeDataToAttrs(token.getData()),
            content: encodeTokensToJSON(tokens)
        };
    }

    var markType = getMarkType(type);
    var marks = [];

    if (markType !== 'text') {
        marks = [
            {
                '_': markType,
                'attrs': encodeDataToAttrs(token.getData())
            }
        ];
    }

    return {
        type: 'text',
        marks: marks,
        text: token.getText()
    };
}

/**
 * Encode a list of tokens to JSON
 *
 * @paran {List<Token>} tokens
 * @return {Array}
 */
function encodeTokensToJSON(tokens) {
    return tokens.map(encodeTokenToJSON).toJS();
}

/**
 * Encode a Content into a ProseMirror JSON object
 *
 * @paran {Content} content
 * @return {Object}
 */
function encodeContentToProseMirror(content) {
    return {
        type: 'doc',
        content: encodeTokensToJSON(content.getTokens())
    };
}

module.exports = encodeContentToProseMirror;
