
/*
    Cleanup a text before parsing: normalize newlines and tabs

    @param {String} src
    @return {String}
*/
function cleanupText(src) {
    return src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n')
    .replace(/^ +$/gm, '');
}

module.exports = cleanupText;
