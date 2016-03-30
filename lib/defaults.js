var Rule = require('./rule');

var BLOCKS = require('./constants/blocks');
var STYLES = require('./constants/styles');

var defaultBlockRule = Rule(BLOCKS.PARAGRAPH)
    .toText('%s');

var defaultInlineRule = Rule(STYLES.TEXT)
    .option('parseInline', false)
    .toText('%s');

module.exports = {
    blockRule: defaultBlockRule,
    inlineRule: defaultInlineRule
};
