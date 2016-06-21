var lex = require('./lex');

function ParsingState(syntax) {
    if (!(this instanceof ParsingState)) {
        return new ParsingState(syntax);
    }

    this._ = {};
    this.depth = 0;
    this.syntax = syntax;
}

/**
 * Get depth of parsing
 * @return {Number}
 */
ParsingState.prototype.getDepth = function() {
    return this.depth;
};

/**
 * Get a state
 * @param {String} key
 * @return {Mixed}
 */
ParsingState.prototype.get = function(key) {
    return this._[key];
};

/**
 * Toggle a state and execute the function
 * @param {String} key
 * @param {[type]} [varname] [description]
 * @return {Mixed}
 */
ParsingState.prototype.toggle = function(key, fn) {
    this._[key] = true;
    var result = fn();
    this._[key] = false;

    return result;
};

/**
 * Parse a text using a set of rules
 * @param {RulesSet} rules
 * @param {Boolean} isInline
 * @param {String} text
 * @return {List<Token>}
 */
ParsingState.prototype.parse = function(rulesSet, isInline, text) {
    this.depth++;

    var rules = rulesSet.getRules();
    var tokens = lex(this, rules, isInline, text);

    this.depth--;

    return tokens;
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
