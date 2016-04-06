var Markup = require('./markup');

var BLOCKS = require('./constants/blocks');
var STYLES = require('./constants/styles');
var ENTITIES = require('./constants/entities');

var Content = require('./models/content');
var Syntax = require('./models/syntax');
var Rule = require('./models/rule');
var RulesSet = require('./models/rules');
var Token = require('./models/token');

var parse = require('./parse');
var render = require('./render');

var DraftUtils = require('./draft');
var JSONUtils = require('./json');

module.exports = Markup;

// Method
module.exports.parse = parse;
module.exports.parseInline = parse.inline;

module.exports.render = render;

// Models
module.exports.Content = Content;
module.exports.Token = Token;
module.exports.Syntax = Syntax;
module.exports.Rule = Rule;
module.exports.RulesSet = RulesSet;

// Utils
module.exports.DraftUtils = DraftUtils;
module.exports.JSONUtils = JSONUtils;

// Constants
module.exports.STYLES = STYLES;
module.exports.ENTITIES = ENTITIES;
module.exports.BLOCKS = BLOCKS;
