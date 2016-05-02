var Rule = require('../models/rule');

var BLOCKS = require('./blocks');
var STYLES = require('./styles');

var defaultBlockRule = Rule(BLOCKS.UNSTYLED)
    .toText('%s');

var defaultInlineRule = Rule(STYLES.TEXT)
    .setOption('parse', false)
    .toText('%s');

module.exports = {
    blockRule: defaultBlockRule,
    inlineRule: defaultInlineRule
};
