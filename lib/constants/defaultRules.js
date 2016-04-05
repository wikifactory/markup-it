var Rule = require('../models/rule');

var BLOCKS = require('./blocks');
var STYLES = require('./styles');

var defaultBlockRule = Rule(BLOCKS.PARAGRAPH)
    .toText('%s');

var defaultInlineRule = Rule(STYLES.TEXT)
    .setOption('parseInline', false)
    .toText('%s');

module.exports = {
    blockRule: defaultBlockRule,
    inlineRule: defaultInlineRule
};
