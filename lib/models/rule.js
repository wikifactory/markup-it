var Immutable = require('immutable');
var is = require('is');
var inherits = require('util').inherits;

var RuleRecord = Immutable.Record({
    // Type of the rule
    type: new String(),

    // Options for this rule
    options: new Immutable.Map({
        // Mode for parsing inner content of a token
        // Values can be "inline", "block" or false
        parse: 'inline',

        // Render inner content
        renderInner: true
    }),

    // Listener / Handlers {Map(<String,List<Function>)}
    listeners: new Immutable.Map()
});

function Rule(type) {
    if (!(this instanceof Rule)) return new Rule(type);

    RuleRecord.call(this, {
        type: type
    });
}
inherits(Rule, RuleRecord);

// ---- GETTERS ----

Rule.prototype.getType = function() {
    return this.get('type');
};

Rule.prototype.getOptions = function() {
    return this.get('options');
};

Rule.prototype.getListeners = function() {
    return this.get('listeners');
};

// ---- METHODS ----

/*
    Add a listener
    @param {String} key
    @param {Function} fn
    @return {Rule}
*/
Rule.prototype.on = function(key, fn) {
    var listeners = this.getListeners();

    // Add the function to the list
    var fns = listeners.get(key) || new Immutable.List();
    fns = fns.push(fn);

    listeners = listeners.set(key, fns);

    return this.set('listeners', listeners);
};

/*
    Set an option
    @param {String} key
    @param {String|Number|Boolean} value
    @return {Rule}
*/
Rule.prototype.setOption = function(key, value) {
    var options = this.getOptions();

    options = options.set(key, value);

    return this.set('options', options);
};

/*
    Get an option
    @param {String} key
    @return {String|Number|Boolean}
*/
Rule.prototype.getOption = function(key, defaultValue) {
    var options = this.getOptions();
    return options.get(key, defaultValue);
};

/*
    Add a template or function to render a token

    @param {String|Function} fn
    @return {Rule}
*/
Rule.prototype.toText = function(fn) {
    if (is.string(fn)) {
        var tpl = fn;
        fn = function (text) {
            return tpl.replace('%s', text);
        };
    }

    return this.on('text', fn);
};

/*
    Add a finish callback

    @param {Function} fn
    @return {Rule}
*/
Rule.prototype.finish = function(fn) {
    return this.on('finish', fn);
};

/*
    Add a match callback

    @param {Function} fn
    @return {Rule}
*/
Rule.prototype.match = function(fn) {
    return this.on('match', fn);
};

/*
    Add a match callback using a RegExp

    @param {RegExp} re
    @param {Funciton} propsFn
    @return {Rule}
*/
Rule.prototype.regExp = function(re, propsFn) {
    var ruleType = this.get('type');

    return this.match(function(text) {
        var block = {};

        var match = re.exec(text);
        if (!match) return null;

        if (propsFn) block = propsFn.call(this, match);
        if (!block) return null;
        if (is.array(block)) return block;

        block.raw = is.undefined(block.raw)? match[0] : block.raw;
        block.text = is.undefined(block.text)? match[0] : block.text;
        block.type = block.type || ruleType;

        return block;
    });
};

/*
    Call listerners with a specific set of data

    @param {String} key
    @return {Mixed}
*/
Rule.prototype.emit = function(key, ctx) {
    var args = Array.prototype.slice.call(arguments, 2);
    var listeners = this.getListeners();

    // Add the function to the list
    var fns = listeners.get(key) || new Immutable.List();

    return fns.reduce(function(result, fn) {
        if (result) return result;

        return fn.apply(ctx, args);
    }, null);
};

// Parse a text in a specific context
Rule.prototype.onText = function(ctx, text) {
    return this.emit('match', ctx, text);
};

// Parsing is finished
Rule.prototype.onFinish = function(ctx, token) {
    return this.emit('finish', ctx, token) || token;
};

// Output inner of block as a string
Rule.prototype.onToken = function(ctx, text, entity, pos) {
    return this.emit('text', ctx,  text, entity, pos);
};

module.exports = Rule;
