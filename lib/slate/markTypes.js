var Immutable = require('immutable');

var STYLES = require('../constants/styles');
var ENTITIES = require('../constants/entities');

module.exports = Immutable.List([
    STYLES.BOLD,
    STYLES.ITALIC,
    STYLES.CODE,
    STYLES.STRIKETHROUGH,
    ENTITIES.LINK
]);
