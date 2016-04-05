var Immutable = require('immutable');
var inherits = require('util').inherits;

var RulesSet = require('./rules');
var defaultRules = require('../constants/defaultRules');

var SyntaxSetRecord = Immutable.Record({
    name: String(),
    inline: new RulesSet([]),
    blocks: new RulesSet([])
});

function SyntaxSet(name, def) {
    if (!(this instanceof SyntaxSet)) {
        return new SyntaxSet(name, def);
    }

    SyntaxSetRecord.call(this, {
        name: name,
        inline: new RulesSet(def.inline),
        blocks: new RulesSet(def.blocks)
    });
}
inherits(SyntaxSet, SyntaxSetRecord);

// ---- GETTERS ----
SyntaxSet.prototype.getName = function() {
    return this.get('name');
};

SyntaxSet.prototype.getBlockRulesSet = function() {
    return this.get('blocks');
};

SyntaxSet.prototype.getInlineRulesSet = function() {
    return this.get('inline');
};

// ---- METHODS ----

SyntaxSet.prototype.getBlockRules = function() {
    return this.getBlockRulesSet().getRules();
};

SyntaxSet.prototype.getInlineRules = function() {
    return this.getInlineRulesSet().getRules();
};

SyntaxSet.prototype.getInlineRule = function(type) {
    var rulesSet = this.getInlineRulesSet();
    return rulesSet.getRule(type) || defaultRules.inlineRule;
};

SyntaxSet.prototype.getBlockRule = function(type) {
    var rulesSet = this.getBlockRulesSet();
    return rulesSet.getRule(type) || defaultRules.blockRule;
};

module.exports = SyntaxSet;
