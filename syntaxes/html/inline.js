var markup = require('../../');
var utils = require('./utils');

var HTMLRule = require('./rule');

module.exports = [
    // ---- TEXT ----
    markup.Rule(markup.STYLES.TEXT)
        .setOption('parseInline', false)
        .toText(utils.escape),

    // ---- CODE ----
    HTMLRule(markup.STYLES.CODE, 'code')
        .setOption('parseInline', false),

    // ---- BOLD ----
    HTMLRule(markup.STYLES.BOLD, 'b'),

    // ---- ITALIC ----
    HTMLRule(markup.STYLES.ITALIC, 'i'),

    // ---- STRIKETHROUGH ----
    HTMLRule(markup.STYLES.STRIKETHROUGH, 'strike'),

    // ---- IMAGES ----
    HTMLRule(markup.ENTITIES.IMAGE, 'img'),

    // ---- LINK ----
    HTMLRule(markup.ENTITIES.LINK, 'a'),

    // ---- FOOTNOTE ----
    HTMLRule(markup.ENTITIES.FOOTNOTE_REF, 'a', function(data, token) {
        return {
            'href': '#footnote-' + token.text,
            'class': 'footnote-ref'
        };
    })
];
