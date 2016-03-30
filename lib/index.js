var Markup = require('./markup');

var BLOCKS = require('./constants/blocks');
var STYLES = require('./constants/styles');
var ENTITIES = require('./constants/entities');

module.exports = Markup;
module.exports.Syntax = require('./syntax');
module.exports.Rule = require('./rule');
module.exports.Entity = require('./entity');
module.exports.Range = require('./range');
module.exports.STYLES = STYLES;
module.exports.ENTITIES = ENTITIES;
module.exports.BLOCKS = BLOCKS;
