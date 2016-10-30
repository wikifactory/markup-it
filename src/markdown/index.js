const heading = require('./heading');
const paragraph = require('./paragraph');
const codeBlock = require('./code-block');
const code = require('./code');
const bold = require('./bold');
const italic = require('./italic');
const strikethrough = require('./strikethrough');

module.exports = [
    codeBlock,
    heading,
    paragraph,
    // Marks
    italic,
    bold,
    code,
    strikethrough
];
