var markup = require('../../');
var markdown = require('../markdown');

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

var inlineRules = markdown.getInlineRules();
inlineRules = inlineRules
    .unshift(inlineMathRule)
    .unshift(tplExpr);

var blockRules = markdown.getBlockRules();
blockRules = blockRules
    .unshift(blockMathRule);


module.exports = markup.Syntax('gitbook+markdown', {
    inline: inlineRules,
    blocks: blockRules
});
