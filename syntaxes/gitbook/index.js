var markup = require('../../');
var markdown = require('../markdown');

var reMathInline = /^\$\$([^$\n]+)\$\$/;
var reMathBlock = /^\$\$\n([^$]+)\n\$\$/;
var reTpl = /^{([#%{])\s*(.*?)\s*(?=[#%}]})}}/;

var inlineMathRule = markup.Rule(markup.ENTITIES.MATH)
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

var blockMathRule = markup.Rule(markup.BLOCKS.MATH)
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

var tplExpr = markup.Rule(markup.STYLES.TEMPLATE)
    .regExp(reTpl, function(state, match) {
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
    .toText(function(sttae, token) {
        var data = token.getData();
        var text = token.getText();
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


module.exports = markup.Syntax('gitbook+markdown', {
    inline: inlineRules,
    blocks: blockRules
});
