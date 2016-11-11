const heading = require('./heading');
const paragraph = require('./paragraph');
const codeBlock = require('./code');
const blockquote = require('./blockquote');
const unstyled = require('./unstyled');

module.exports = [
    blockquote,
    codeBlock,
    heading,
    paragraph,
    unstyled
];
