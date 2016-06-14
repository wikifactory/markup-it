
/**
 * Encode a token to JSON
 *
 * @paran {Token} tokens
 * @return {Object}
 */
function encodeTokenToJSON(token) {
    return {
        type: token.getType(),
        text: token.getText(),
        data: token.getData().toJS(),
        tokens: encodeTokensToJSON(token.getTokens())
    };
}

/**
 * Encode a list of tokens to JSON
 *
 * @paran {List<Token>} tokens
 * @return {Object}
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
        tokens: encodeTokensToJSON(content.getTokens())
    };
}

module.exports = encodeContentToJSON;
