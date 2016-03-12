var RulesSet = require('./rules');
var defaults = require('./defaults');

// A syntax set represents a group of two rules: inlines and blocks
function SyntaxSet(rules) {
    if (!(this instanceof SyntaxSet)) return new SyntaxSet(rules);

    this.inlines = new RulesSet(rules.inlines || []);
    this.blocks = new RulesSet(rules.blocks || []);
}

// Return an rules or the default ones
SyntaxSet.prototype.getInlineRule = function(type) {
    return this.inlines.get(type) || defaults.inlineRule;
};
SyntaxSet.prototype.getBlockRule = function(type) {
    return this.blocks.get(type) || defaults.inlineRule;
};

module.exports = SyntaxSet;
