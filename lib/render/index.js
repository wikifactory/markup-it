/*
    Render a list tokens using a transformation function

    @param {List<Token>}
    @return {String}
*/
function renderTokens(tokens, fn, depth) {
    depth = depth || 0;

    return tokens.map(function(token) {
        var innerText = token.getText();

        var innerTokens = token.getTokens();
        if (innerTokens.size > 0) {
            innerText = renderTokens(innerTokens, fn, depth + 1);
        }

        return fn(innerText, token, depth);
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

    return renderTokens(tokens, function(text, tok, depth) {
        var isInline = (depth > 0);

        if (isInline) return onInlineToken.apply(this, arguments);
        else return onBlockToken.apply(this, arguments);
    });
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
