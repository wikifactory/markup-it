var is = require('is');


// Compile base rule
function compileRule(rule) {
    if (rule.regexp) {
        rule.match = function(str) {
            var block = {};

            var match = rule.regexp.exec(str);
            if (!match) return null;

            if (rule.props) block = rule.props(match);

            block.raw = block.raw || match[0];
            block.text = block.text || match[0];
            block.type = block.type || rule.type;

            return block;
        };
    }

    if (is.string(rule.toText)) {
        var tpl = rule.toText;
        rule.toText = function(text) {
            return tpl.replace('%s', text);
        };
    }

    return rule;
}

module.exports = {
    compile: compileRule
};
