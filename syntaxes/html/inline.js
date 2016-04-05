var markup = require('../../');
var utils = require('./utils');

module.exports = [
    // ---- TEXT ----
    markup.Rule(markup.STYLES.TEXT)
        .setOption('parseInline', false)
        .toText(utils.escape),

    // ---- CODE ----
    markup.Rule(markup.STYLES.CODE)
        .setOption('parseInline', false)
        .toText('<code>%s</code>'),

    // ---- BOLD ----
    markup.Rule(markup.STYLES.BOLD)
        .toText('<b>%s</b>'),

    // ---- ITALIC ----
    markup.Rule(markup.STYLES.ITALIC)
        .toText('<i>%s</i>'),

    // ---- STRIKETHROUGH ----
    markup.Rule(markup.STYLES.STRIKETHROUGH)
        .toText('<strike>%s</strike>')

];
