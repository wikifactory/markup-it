
/*
    Return context to describe a token
*/
function getTokenCtx(token) {
    return {
        type: token.getType(),
        text: token.getText(),
        raw: token.getRaw(),
        data: token.getData().toJS()
    };
}

/*
    Render a Content instance using a syntax

    @param {Content}
    @return {String}
*/
function render(syntax, content) {
    var ctx = {};

    function _renderTokens(tokens, depth) {
        depth = depth || 0;

        return tokens.map(function(token, i) {
            var tokenType = token.getType();
            var innerText = token.getText();
            var innerTokens = token.getTokens();
            var rule;

            if (token.isInline()) {
                rule = syntax.getInlineRule(tokenType);
            } else {
                rule = syntax.getBlockRule(tokenType);
            }

            if (rule.getOption('renderInner') && innerTokens.size > 0) {
                innerText = _renderTokens(innerTokens, depth + 1);
            }


            // Create context to describe a token
            var prevToken = i > 0? tokens.get(i - 1) : null;
            var nextToken = i < (tokens.size - 1)? tokens.get(i + 1) : null;

            var tokenCtx = getTokenCtx(token);
            tokenCtx.next = nextToken? getTokenCtx(nextToken) : null;
            tokenCtx.prev = prevToken? getTokenCtx(prevToken) : null;

            return rule.onToken(ctx, innerText, tokenCtx);
        }).join('');
    }

    return _renderTokens(content.getTokens());
}

module.exports = render;
