var RulesSet = require('./rules');

// A syntax set represents a group of two rules: inlines and blocks
function SyntaxSet(rules) {
    if (!(this instanceof SyntaxSet)) return new SyntaxSet(rules);

    this.inlines = new RulesSet(rules.inlines);
    this.blocks = new RulesSet(rules.blocks);
}


module.exports = SyntaxSet;
