var reBlock = require('./re/block');
var markup = require('../../');
var utils = require('./utils');

// Rule for parsing code blocks
var blockRule = markup.Rule(markup.BLOCKS.CODE)
    .setOption('parse', false)

    // Currently causing problem since entities ar inlined
    .setOption('renderInner', false)

    // Fences
    .regExp(reBlock.fences, function(match) {
        return {
            text: match[3],
            data: {
                syntax: match[2]
            }
        };
    })

    // 4 spaces / Tab
    .regExp(reBlock.code, function(match) {
        var inner = match[0];
        var lines = utils.splitLines(inner);

        // Remove indentation
        inner = lines.map(function(line) {
            return line.replace(/^( {4}|\t)/, '');
        })
        .join('\n')
        .replace(/\s+$/g, '');

        return {
            text: inner,
            data: {
                syntax: null
            }
        };
    })

    // Output code blocks
    .toText(function(text, block) {
        // Use fences if syntax is set
        if (block.data.syntax) {
            return (
                '```'
                + block.data.syntax
                + '\n'
                + text
                + '\n```\n\n'
            );
        }

        // Use four spaces otherwise
        var lines = utils.splitLines(text);

        return lines.map(function(line) {
            if (!line.trim()) return '';
            return '    ' + line;
        }).join('\n') + '\n\n';
    });


module.exports = {
    block: blockRule
};
