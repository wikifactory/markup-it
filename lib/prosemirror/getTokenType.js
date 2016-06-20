var nodeTypes = require('./nodeTypes');

/**
 * Get token type for a node/mark
 * @param  {String} type
 * @return {String}
 */
module.exports = function getTypeType(type) {
    return nodeTypes.flip().get(type);
};
