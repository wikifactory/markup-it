var is = require('is');

/**
 * Annotate a token using an iter
 *
 * @param {Token} token
 * @param {Function} iter
 * @return {String}
 */
function annotateToken(token, iter) {
    console.log('annotateToken', token.toJS());
    var result = iter(token);

    if (is.string(result)) {
        return result;
    }

    // Keep raw content
    if (result === true) {
        return token.getRaw();
    }

    // Keep annotating
    var tokens = token.getTokens();

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
