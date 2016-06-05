var markup = require('../../');
var markdown = require('../markdown');

var reMathInline = /^\$\$([^$\n]+)\$\$/;
var reMathBlock = /^\$\$\n([^$]+)\n\$\$/;
var reTpl = /^{([#%{])\s*(.*?)\s*(?=[#%}]})}}/;

var inlineMathRule = markup.Rule(markup.ENTITIES.MATH)
    .setOption('parse', false)
    .setOption('renderInner', false)
    .regExp(reMathInline, function(match) {
        var text = match[1];
        if (text.trim().length == 0) return;

        return {
            text: text,
            data: {}
        };
    })
    .toText(function(text, block) {
        return '$$' + text + '$$';
    });

var blockMathRule = markup.Rule(markup.BLOCKS.MATH)
    .setOption('parse', false)
    .setOption('renderInner', false)
    .regExp(reMathBlock, function(match) {
        var text = match[1];
        if (text.trim().length == 0) return;

        return {
            text: text
        };
    })
    .toText(function(text, block) {
        return '$$\n' + text + '\n$$\n\n';
    });

var tplExpr = markup.Rule(markup.STYLES.TEMPLATE)
    .setOption('parse', false)
    .regExp(reTpl, function(match) {
        var type = match[0];
        var text = match[2];

        if (type == '%') type = 'expr';
        else if (type == '#') type = 'comment';
        else if (type == '{') type = 'var';

        return {
            text: text,
            data: {
                type: type
            }
        };
    })
    .toText(function(text, block) {
        var type = block.data.type;

        if (type == 'expr') text = '{% ' + text + ' %}';
        else if (type == 'comment') text = '{# ' + text + ' #}';
        else if (type == 'var') text = '{{ ' + text + ' }}';

        return text;
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
