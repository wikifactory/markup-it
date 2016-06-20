var Immutable = require('immutable');
var BLOCKS = require('../constants/blocks');
var ENTITIES = require('../constants/entities');

module.exports = Immutable.Map([
    [ENTITIES.IMAGE, 'image'],

    [BLOCKS.HR, 'horizontal_rule'],

    [BLOCKS.OL_LIST, 'ordered_list'],
    [BLOCKS.UL_LIST, 'bullet_list'],
    [BLOCKS.LIST_ITEM, 'list_item'],

    [BLOCKS.CODE, 'code'],
    [BLOCKS.PARAGRAPH, 'paragraph'],
    [BLOCKS.BLOCKQUOTE, 'blockquote'],

    [BLOCKS.TABLE, 'table'],
    [BLOCKS.TABLE_HEAD, null],
    [BLOCKS.TABLE_BODY, null],
    [BLOCKS.TABLE_ROW, 'table_row'],
    [BLOCKS.TABLE_CELL, 'table_cell']
]);

