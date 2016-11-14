const text = require('./text');
const code = require('./code');
const bold = require('./bold');
const italic = require('./italic');
const footnote = require('./footnote');
const image = require('./image');
const strikethrough = require('./strikethrough');

module.exports = [
    footnote,
    image,
    // Code mark should be applied before everything else
    code,
    // Bold should be before italic
    bold,
    italic,
    strikethrough,
    text
];
