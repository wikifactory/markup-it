var is = require('is');

function Rule(type) {
    if (!(this instanceof Rule)) {
        return new Rule(type);
    }

    this.type = type;
    this.opts = {};
    this._matchFns = [];
    this._on = {
        finish: [],
        match: [],
        text: []
    };
    this._toText = null;
}

// ---- Building the rule

// Add a function to match some text
// If the function returns null, other function will be tried, then other rules
Rule.prototype.match = function(fn) {
    return this.on('match', fn);
};

Rule.prototype.finish = function(fn) {
    return this.on('finish', fn);
};

Rule.prototype.toText = function(fn) {
    if (is.string(fn)) {
        var tpl = fn;
        fn = function(text) {
            return tpl.replace('%s', text);
        };
    }

    return this.on('text', fn);
};

// Bind a function for an "event"
Rule.prototype.on = function(type, fn) {
    this._on[type].push(fn);
    return this;
};

// Define function to output as text

// Match text against this rule
Rule.prototype.regExp = function(re, propsFn) {
    var that = this;

    return this.match(function(text) {
        var block = {};

        var match = re.exec(text);
        if (!match) return null;

        if (propsFn) block = propsFn.call(this, match);
        if (!block) return null;

        block.raw = is.undefined(block.raw)? match[0] : block.raw;
        block.text = is.undefined(block.text)? match[0] : block.text;
        block.type = block.type || that.type;

        return block;
    });
};

// Get/Set an option
Rule.prototype.option = function option(key, value) {
    if (is.undefined(value)) return this.opts[key];
    this.opts[key] = value;
    return this;
};

// ---- Using the rule

// Parse a text in a specific context
Rule.prototype.onText = function onText(ctx, text) {
    return this.trigger('match', ctx, text);
};

// Parsing is finished
Rule.prototype.onFinish = function onFinish(ctx, text, entity) {
    return this.trigger('finish', ctx, text, entity) || entity;
};

// Output inner of block as a string
Rule.prototype.onContent = function onBlockContent(ctx, text, entity, pos) {
    return this.trigger('text', ctx,  text, entity, pos);
};

// Trigger a specific method
Rule.prototype.trigger = function trigger(type, ctx) {
    var args = Array.prototype.slice.call(arguments, 2);

    return this._on[type].reduce(function(result, fn) {
        if (result) return result;

        return fn.apply(ctx, args);
    }, null);
};

module.exports = Rule;
