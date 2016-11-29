const text = require('./text');
const footnote = require('./footnote');
const image = require('./image');
const link = require('./link');
const html = require('./html');
const math = require('./math');
const escape = require('./escape');
const template = require('./template');

module.exports = [
    footnote,
    image,
    link,
    math,
    html,
    template,
    text
];
