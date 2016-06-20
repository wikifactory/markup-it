var Immutable = require('immutable');

var STYLES = require('../constants/styles');
var ENTITIES = require('../constants/entities');

module.exports = Immutable.Map([
    [STYLES.BOLD, 'strong'],
    [STYLES.ITALIC, 'em'],
    [STYLES.CODE, 'code'],
    [STYLES.STRIKETHROUGH, 'strike'],
    [STYLES.TEXT, 'text'],

    [ENTITIES.LINK, 'link']
]);

