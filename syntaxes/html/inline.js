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
        .toText('<strike>%s</strike>'),

    // ---- IMAGES ----
    markup.Rule(markup.ENTITIES.IMAGE)
        .toText(function(text, token) {
            return '<img src="' + token.data.src +'" title="' + token.data.title + '" />';
        }),

    // ---- LINK ----
    markup.Rule(markup.ENTITIES.LINK)
        .toText(function(text, token) {
            return '<a href="' + token.data.href +'" title="' + (token.data.title || '') + '">' + text + '</a>';
        })

];
