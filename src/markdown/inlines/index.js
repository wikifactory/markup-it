const text = require('./text');
const code = require('./code');
const bold = require('./bold');
const italic = require('./italic');
const footnote = require('./footnote');
const image = require('./image');
const link = require('./link');
const html = require('./html');
const math = require('./math');
const template = require('./template');
const strikethrough = require('./strikethrough');

module.exports = [
    footnote,
    image,
    link,
    math,
    // Code mark should be applied before everything else
    code,
    // Bold should be before italic
    bold,
    italic,
    strikethrough,
    html,
    template,
    text
];
