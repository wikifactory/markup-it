var markup = require('../../');
var markdownRules = require('../markdown');
var syntax = markup.Syntax(markdownRules);

var reMathInline = /^\$\$([^$\n]+)\$\$/;
var reMathBlock = /^\$\$\n([^$]+)\n\$\$/;
var reTpl = /^{([#%{])\s*(.*?)\s*(?=[#%}]})}}/;


var inlineMathRule = markup.Rule('math')
    .setOption('parseInline', false)
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
    .setOption('parseInline', false)
    .regExp(reMathBlock, function(match) {
        var text = match[1];
        if (text.trim().length == 0) return;

        return {
            text: text
        };
    });

var tplExpr = markup.Rule('template')
    .setOption('parseInline', false)
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
syntax.inline.unshift(inlineMathRule);
syntax.inline.unshift(tplExpr);
syntax.blocks.unshift(blockMathRule);

module.exports = syntax;
