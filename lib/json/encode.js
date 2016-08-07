
/**
 * Encode data of a token, it ignores undefined value
 *
 * @paran {Map} data
 * @return {Object}
 */
function encodeDataToJSON(data) {
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
    if (token.isText()) {
        return {
            type: token.getType(),
            text: token.getText()
        };
    }

    var json = {
        type: token.getType()
    };

    var data = token.getData();
    if (data.size > 0) {
        json.data = encodeDataToJSON(data);
    }

    json.tokens = encodeTokensToJSON(token.getTokens());

    return json;
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
 * Encode a Content into a JSON object
 *
 * @paran {Content} content
 * @return {Object}
 */
function encodeContentToJSON(content) {
    return {
        syntax: content.getSyntax(),
        token:  encodeTokenToJSON(content.getToken())
    };
}

module.exports = encodeContentToJSON;
