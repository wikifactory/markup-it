const hr = require('./hr');
const heading = require('./heading');
const paragraph = require('./paragraph');
const codeBlock = require('./code');
const blockquote = require('./blockquote');
const unstyled = require('./unstyled');
const footnote = require('./footnote');
const table = require('./table');

module.exports = [
    table,
    footnote,
    blockquote,
    codeBlock,
    heading,
    hr,
    paragraph,
    unstyled
];
