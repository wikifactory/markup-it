

/*
    Render inline tokens

    @param {List<Token>}
    @return {String}
*/
function renderTokens(tokens, fn) {
    return tokens.map(function(tok) {
        return fn(tok.getText(), tok);
    }).join('');
}

/*
    Convert a Content instance into a string using
    two rendering functions: onBlockToken and onInlineToken

    Both rendering function are called as fn(text, token)

    @param {Content}
    @return {String}
*/
function render(content, onBlockToken, onInlineToken) {

    var tokens = content.getTokens();

    return tokens.map(function(token) {
        var innerText = token.getText();

        var inlineTokens = token.getTokens();
        if (inlineTokens.size > 0) {
            innerText = renderTokens(inlineTokens, onInlineToken);
        }

        return onBlockToken(innerText, token);
    }).join('');
}

/*
    Render a Content instance using a syntax

    @param {Content}
    @return {String}
*/
function renderWithSyntax(syntax, content) {
    var ctx = {};

    return render(
        content,

        // Render block tokens
        function(text, token) {
            var tokenType = token.getType();
            var rule = syntax.getBlockRule(tokenType);

            return rule.onToken(ctx, text, token.toJS());
        },

        // Render inline tokens
        function(text, token) {
            var tokenType = token.getType();
            var rule = syntax.getInlineRule(tokenType);

            return rule.onToken(ctx, text, token.toJS());
        }
    );
}

module.exports = render;
module.exports.withSyntax = renderWithSyntax;
