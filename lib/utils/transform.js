var Immutable = require('immutable');
var Content = require('../models/content');

/**
 * Walk throught the children tokens tree, and
 * map each token using a transformation
 *
 * @param {Token|Content} base
 * @param {Function(token, depth)} iter
 * @param {Number} depth
 * @return {Token}
 */
function transform(base, iter, depth) {
    depth = depth || 0;
    var tokens = base.getTokens();

    tokens = tokens.map(function(token) {
        return transform(token, iter, depth + 1);
    });

    base = base.set('tokens', tokens);

    return (base instanceof Content)? base : iter(base, depth);
}

module.exports = transform;
