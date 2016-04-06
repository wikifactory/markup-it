var Markup = require('./markup');

var BLOCKS = require('./constants/blocks');
var STYLES = require('./constants/styles');
var ENTITIES = require('./constants/entities');

var Syntax = require('./models/syntax');
var Rule = require('./models/rule');
var RulesSet = require('./models/rules');

var parse = require('./parse');

var DraftUtils = require('./draft');

module.exports = Markup;

// Method
module.exports.parse = parse;
module.exports.parseInline = parse.inline;

// Models
module.exports.Syntax = Syntax;
module.exports.Rule = Rule;
module.exports.RulesSet = RulesSet;

// Utils
module.exports.DraftUtils = DraftUtils;

// Constants
module.exports.STYLES = STYLES;
module.exports.ENTITIES = ENTITIES;
module.exports.BLOCKS = BLOCKS;
