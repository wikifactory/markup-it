var transform = require('../utils/transform');

/*
    Post processing for parsing.
    Call `onFinish` of rules.

    @param {Syntax} syntax
    @param {List<Token>} tokens

    @return {List<Token>}
*/
function finish(syntax, content, ctx) {
    return transform(content, function(token, depth) {
        var tokenType = token.getType();
        var isInline = depth > 1;
        var rule;

        if (isInline) {
            rule = syntax.getInlineRule(tokenType);
        } else {
            rule = syntax.getBlockRule(tokenType);
        }

        var def = {
            type: token.getType(),
            data: token.getData().toJS(),
            text: token.getText(),
            raw: token.getRaw()
        };

        return token.merge(
            rule.onFinish(ctx, def)
        );
    });
}


module.exports = finish;
