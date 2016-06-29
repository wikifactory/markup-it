var MarkupIt = require('../../');
var markdown = require('../markdown');

var reMathInline = /^\$\$([^$\n]+)\$\$/;
var reMathBlock  = /^\$\$\n([^$]+)\n\$\$/;
var reTpl        = /^{([#%{])\s*(.*?)\s*( ?= [#%}]})}}/;

var inlineMathRule = MarkupIt.Rule(MarkupIt.ENTITIES.MATH)
    .regExp(reMathInline, function(state, match) {
        var text = match[1];
        if (text.trim().length == 0) {
            return;
        }

        return {
            data: {
                tex: text
            }
        };
    })
    .toText(function(state, token) {
        return '$$' + token.getData().get('tex') + '$$';
    });

var blockMathRule = MarkupIt.Rule(MarkupIt.BLOCKS.MATH)
    .regExp(reMathBlock, function(state, match) {
        var text = match[1];
        if (text.trim().length == 0) {
            return;
        }

        return {
            data: {
                tex: text
            }
        };
    })
    .toText(function(state, token) {
        return '$$\n' + token.getData().get('tex') + '\n$$\n\n';
    });

var tplExpr = MarkupIt.Rule(MarkupIt.STYLES.TEMPLATE)
    .regExp(reTpl, function(state, match) {
        var type = match[0];
        var text = match[2];

        if (type == '%') type = 'expr';
        else if (type == '#') type = 'comment';
        else if (type == '{') type = 'var';

        return {
            data: {
                type: type
            },
            tokens: [
                MarkupIt.Token.createText(text)
            ]
        };
    })
    .toText(function(state, token) {
        var data = token.getData();
        var text = token.getAsPlainText();
        var type = data.get('type');

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


module.exports = MarkupIt.Syntax('gitbook+markdown', {
    inline: inlineRules,
    blocks: blockRules
});
