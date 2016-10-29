const heading = require('./heading');
const paragraph = require('./paragraph');
const codeBlock = require('./code-block');
const bold = require('./bold');
const italic = require('./italic');

module.exports = [
    codeBlock,
    heading,
    paragraph,
    // Marks
    italic,
    bold
];
