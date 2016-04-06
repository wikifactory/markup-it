var ENTITIES = require('../constants/entities');

var MUTABLE = 'MUTABLE';
var IMMUTABLE = 'IMMUTABLE';

var MUTABLE_TYPES = [
    ENTITIES.LINK, ENTITIES.LINK_REF, ENTITIES.FOOTNOTE_REF
];

/*
    Get mutability of a token

    @param {Token} token
    @return @String
*/
function getMutability(token) {
    return (MUTABLE_TYPES.indexOf(token.getType()) >= 0)? MUTABLE : IMMUTABLE;
}


module.exports = getMutability;
