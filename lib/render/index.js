
/*
    Render a Content instance using a syntax

    @param {Content}
    @return {String}
*/
function render(syntax, content) {
    var ctx = {};

    function _renderTokens(tokens, depth) {
        depth = depth || 0;
        var isInline = (depth > 0);

        return tokens.map(function(token) {
            var tokenType = token.getType();
            var innerText = token.getText();
            var innerTokens = token.getTokens();
            var rule;

            if (isInline) {
                rule = syntax.getInlineRule(tokenType);
            } else {
                rule = syntax.getBlockRule(tokenType);
            }

            if (rule.getOption('renderInline', true) && innerTokens.size > 0) {
                innerText = _renderTokens(innerTokens, depth + 1);
            }

            return rule.onToken(ctx, innerText, token.toJS());
        }).join('');
    }

    return _renderTokens(content.getTokens());
}

module.exports = render;
