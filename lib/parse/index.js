var Content = require('../models/content');
var ParsingState = require('./state');
var matchRule = require('./matchRule');

/**
 * Parse a text using a syntax
 * @param  {Syntax} syntax
 * @param  {String} text
 * @return {Content}
 */
function parse(syntax, text) {
    var entryRule = syntax.getEntryRule();
    var state     = new ParsingState(syntax);
    var tokens    = matchRule(state, entryRule, text);

    return Content.createFromToken(syntax.getName(), tokens.first());
}

/**
 * Parse a text using a syntax as inline content
 * @param  {Syntax} syntax
 * @param  {String} text
 * @return {List<Token>}
 */
function parseAsInline(syntax, text) {
    var state     = new ParsingState(syntax);
    return state.parseAsInline(text);
}

module.exports          = parse;
module.exports.asInline = parseAsInline;
