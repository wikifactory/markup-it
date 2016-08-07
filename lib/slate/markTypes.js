var Immutable = require('immutable');

var STYLES = require('../constants/styles');

module.exports = Immutable.List([
    STYLES.BOLD,
    STYLES.ITALIC,
    STYLES.CODE,
    STYLES.STRIKETHROUGH
]);
