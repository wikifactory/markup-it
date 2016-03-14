var Markup = require('./markup');

var BLOCKS = require('./blocks');
var INLINES = require('./inlines');

module.exports = Markup;
module.exports.Syntax = require('./syntax');
module.exports.Rule = require('./rule');
module.exports.Entity = require('./entity');
module.exports.BlockEntity = require('./blockEntity');
module.exports.Range = require('./range');
module.exports.INLINES = INLINES;
module.exports.BLOCKS = BLOCKS;
