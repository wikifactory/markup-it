const table = require('./table');

module.exports = [
    require('./paragraph'),
    require('./hr'),
    require('./blockquote'),
    require('./code'),
    require('./heading'),
    require('./ulist'),
    require('./olist'),
    require('./listitem'),
    require('./unstyled'),
    table.table,
    table.row,
    table.cell,
    require('./footnote'),
    require('./html')
];
