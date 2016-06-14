var is = require('is');
var ENTITIES = require('../constants/entities');

var MUTABLE = 'MUTABLE';
var IMMUTABLE = 'IMMUTABLE';

var MUTABLE_TYPES = [
    ENTITIES.LINK, ENTITIES.LINK_REF, ENTITIES.FOOTNOTE_REF
];

/**
 * Get mutability of a token
 *
 * @param {Token|String} token
 * @return @String
 */
function getMutability(token) {
    var tokenType = is.string(token)? token : token.getType();
    return (MUTABLE_TYPES.indexOf(tokenType) >= 0)? MUTABLE : IMMUTABLE;
}


module.exports = getMutability;
