var markup = require('../../');
var utils = require('./utils');

var HTMLRule = require('./rule');

module.exports = [
    // ---- TEXT ----
    markup.Rule(markup.STYLES.TEXT)
        .setOption('parse', false)
        .toText(utils.escape),

    // ---- CODE ----
    markup.Rule(markup.STYLES.CODE)
        .toText(function(text, token) {
            return '<code>' + utils.escape(text) + '</code>';
        }),

    // ---- BOLD ----
    HTMLRule(markup.STYLES.BOLD, 'strong'),

    // ---- ITALIC ----
    HTMLRule(markup.STYLES.ITALIC, 'i'),

    // ---- STRIKETHROUGH ----
    HTMLRule(markup.STYLES.STRIKETHROUGH, 'strike'),

    // ---- IMAGES ----
    HTMLRule(markup.ENTITIES.IMAGE, 'img'),

    // ---- LINK ----
    HTMLRule(markup.ENTITIES.LINK, 'a', function(data) {
        return {
            title: data.title? utils.escape(data.title) : undefined,
            href: utils.escape(data.href || '')
        };
    }),

    // ---- FOOTNOTE ----
    markup.Rule(markup.ENTITIES.FOOTNOTE_REF)
        .toText(function(refname, token) {
            return '<sup><a href="#fn_' + refname + '" id="reffn_' + refname + '">' + refname + '</a></sup>';
        }),

    // ---- HTML ----
    markup.Rule(markup.STYLES.HTML)
        .toText(function(text, token) {
            return token.data.start + text + token.data.end;
        })
];
