const BLOCKS = require('./blocks');

/**
 * List of all block nodes that contains only blocks as children.
 * @type {Array}
 */

module.exports = [
    BLOCKS.BLOCKQUOTE,
    BLOCKS.TABLE,
    BLOCKS.TABLE_ROW,
    BLOCKS.LIST_ITEM,
    BLOCKS.OL_LIST,
    BLOCKS.UL_LIST
];
