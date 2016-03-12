var is = require('is');
var find = require('lodash.find');

// A syntax set represents a group of two rules: inlines and blocks
function RulesSet(rules) {
    if (!(this instanceof RulesSet)) return new RulesSet(rules);

    this.rules = [];
    this.add(rules);
}

// Add a rule / or rules
RulesSet.prototype.add = function(rule) {
    if (rule instanceof RulesSet) {
        rule = rule.toArray();
    }

    if (is.array(rule)) {
        return rule.forEach(this.add.bind(this));
    }

    this.rules.push(rule);
    return this;
};

// Remove a rule by type
RulesSet.prototype.del = function(type) {
    for(var i = this.rules.length-1; i--;){
        if (this.rules[i].type === type) this.rules.splice(i, 1);
    }

    return this;
};

// Update a rule
RulesSet.prototype.replace = function(rule) {
    return this.del(rule.type)
        .add(rule);
};

// Get an inline rule
RulesSet.prototype.get = function(type) {
    return find(this.rules, {
        type: type
    });
};

// Return rules as an array
RulesSet.prototype.toArray = function() {
    return this.rules;
};

module.exports = RulesSet;
