var Markup = require('./markup');

var BLOCKS = require('./constants/blocks');
var STYLES = require('./constants/styles');
var ENTITIES = require('./constants/entities');

var Syntax = require('./models/syntax');
var Rule = require('./models/rule');

module.exports = Markup;
module.exports.Syntax = Syntax;
module.exports.Rule = Rule;
module.exports.Entity = require('./entity');
module.exports.Range = require('./range');
module.exports.STYLES = STYLES;
module.exports.ENTITIES = ENTITIES;
module.exports.BLOCKS = BLOCKS;
