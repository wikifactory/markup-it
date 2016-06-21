var lex = require('./lex');

function ParsingState(syntax) {
    if (!(this instanceof ParsingState)) {
        return new ParsingState(syntax);
    }

    this.syntax = syntax;
}

/**
 * Parse a text using a set of rules
 * @param {RulesSet} rules
 * @param {Boolean} isInline
 * @param {String} text
 * @return {List<Token>}
 */
ParsingState.prototype.parse = function(rulesSet, isInline, text) {
    var rules = rulesSet.getRules();
    return lex(this, rules, isInline, text);
};

/**
 * Parse a text using inline rules
 * @param {String} text
 * @return {List<Token>}
 */
ParsingState.prototype.parseAsInline = function(text) {
    return this.parse(
        this.syntax.getInlineRulesSet(),
        true,
        text
    );
};

/**
 * Parse a text using inline rules
 * @param {String} text
 * @return {List<Token>}
 */
ParsingState.prototype.parseAsBlock = function(text) {
    return this.parse(
        this.syntax.getBlockRulesSet(),
        false,
        text
    );
};

module.exports = ParsingState;
