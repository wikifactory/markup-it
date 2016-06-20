var Content = require('../models/content');
var ParsingState = require('./state');

/**
 * Parse a text using a syntax
 * @param  {Syntax} syntax
 * @param  {String} text
 * @return {Content}
 */
function parse(syntax, text) {
    var state = new ParsingState(syntax);
    var tokens = state.parseAsBlock(text);

    return Content.createFromTokens(syntax.getName(), tokens);
}

module.exports = parse;
