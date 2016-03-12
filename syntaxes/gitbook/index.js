var markup = require('../../');
var markdownRules = require('../markdown');
var syntax = markup.Syntax(markdownRules);

var reMathInline = /^\$\$([^$\n]+)\$\$/;
var reMathBlock = /^\$\$\n([^$]+)\n\$\$/;
var reTpl = /^{([#%{])\s*(.*?)\s*(?=[#%}]})}}/;


var inlineMathRule = markup.Rule('math')
    .regExp(reMathInline, function(match) {
        var text = match[1];
        if (text.trim().length == 0) return;

        return {
            mutability: markup.Entity.MUTABLE,
            text: text,
            data: {}
        };
    });

var blockMathRule = markup.Rule('math-block')
    .option('parseInline', false)
    .regExp(reMathBlock, function(match) {
        var text = match[1];
        if (text.trim().length == 0) return;

        return {
            text: text
        };
    });

var tplExpr = markup.Rule('template')
    .option('parseInline', false)
    .regExp(reTpl, function(match) {
        var type = match[0];
        var text = match[2];

        if (type == '%') type = 'expr';
        else if (type == '#') type = 'comment';
        else if (type == '{') type = 'var';

        return {
            mutability: markup.Entity.MUTABLE,
            text: text,
            data: {
                type: type
            }
        };
    });

// Add rules
syntax.inlines.unshift(inlineMathRule);
syntax.inlines.unshift(tplExpr);
syntax.blocks.unshift(blockMathRule);

module.exports = syntax;
