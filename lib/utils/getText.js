
/**
 * Extract plain text from a token.
 *
 * @param {Token}
 * @return {String}
 */
function getText(token) {
    var tokens = token.getTokens();
    if (tokens.size === 0) {
        return token.getText();
    }

    return tokens.reduce(function(result, tok) {
        return result + tok.getText();
    }, '');
}

module.exports = getText;
