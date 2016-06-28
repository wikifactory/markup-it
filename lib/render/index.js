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

module.exports = render;
