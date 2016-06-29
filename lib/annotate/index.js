var is = require('is');

/**
 * Annotate a token using an iter
 *
 * @param {Token} token
 * @param {Function} iter
 * @return {String}
 */
function annotateToken(token, iter) {
    var result = iter(token);

    if (is.string(result)) {
        return result;
    }

    var tokens = token.getToken();

    if (tokens.size === 0) {
        return token.getRaw();
    }

    return tokens.reduce(function(output, tok) {
        return output + annotateToken(tok, iter);
    }, '');
}

/**
 * Annotate a content using an iter
 *
 * @param {Content} content
 * @param {Function} iter
 * @return {String}
 */
function annotate(content, iter) {
    return annotateToken(content.getToken(), iter);
}

module.exports = annotate;
