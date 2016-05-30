var Rule = require('../models/rule');

var BLOCKS = require('./blocks');
var STYLES = require('./styles');

var defaultBlockRule = Rule(BLOCKS.TEXT)
    .toText('%s\n');

var defaultInlineRule = Rule(STYLES.TEXT)
    .setOption('parse', false)
    .toText('%s');

module.exports = {
    blockRule: defaultBlockRule,
    inlineRule: defaultInlineRule
};
