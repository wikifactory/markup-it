var nodeTypes = require('./nodeTypes');

/**
 * Get node type for a token
 * @param  {String} type
 * @return {String}
 */
module.exports = function getNodeType(type) {
    return nodeTypes.get(type);
};
