var RenderingState = require('./state');

/**
 * Render a Content instance using a syntax
 * @param {Content}
 * @return {String}
 */
function render(syntax, content) {
    var state     = new RenderingState(syntax);
    var entryRule = syntax.getEntryRule();
    var token     = content.getToken();

    return entryRule.onToken(state, token);
}

/**
 * Parse a text using a syntax as inline content
 * @param  {Syntax} syntax
 * @param  {List<Token>} tokens
 * @return {String}
 */
function renderAsInline(syntax, tokens) {
    var state     = new RenderingState(syntax);
    return state.renderAsInline(tokens);
}


module.exports          = render;
module.exports.asInline = renderAsInline;
