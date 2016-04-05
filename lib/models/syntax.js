var Immutable = require('immutable');
var inherits = require('util').inherits;

var RulesSet = require('./rules');
var defaultRules = require('../constants/defaultRules');

var SyntaxSetRecord = Immutable.Record({
    inline: new RulesSet([]),
    blocks: new RulesSet([])
});

function SyntaxSet(def) {
    if (!(this instanceof SyntaxSet)) {
        return new SyntaxSet(def);
    }

    SyntaxSetRecord.call(this, {
        inline: new RulesSet(def.inline),
        blocks: new RulesSet(def.blocks)
    });
}
inherits(SyntaxSet, SyntaxSetRecord);

// ---- GETTERS ----
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
    var rules = this.getInlineRules();
    return rules.get(type) || defaultRules.inlineRule;
};

SyntaxSet.prototype.getBlockRule = function(type) {
    var rules = this.getBlockRules();
    return rules.get(type) || defaultRules.blockRule;
};

module.exports = SyntaxSet;
