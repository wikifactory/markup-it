var markup = require('../../');
var utils = require('./utils');

var HTMLRule = require('./rule');

module.exports = [
    // ---- TEXT ----
    markup.Rule(markup.STYLES.TEXT)
        .toText(function(state, token) {
            return utils.escape(token.getText());
        }),

    // ---- CODE ----
    markup.Rule(markup.STYLES.CODE)
        .toText(function(state, token) {
            return '<code>' + utils.escape(token.getText()) + '</code>';
        }),

    // ---- BOLD ----
    HTMLRule(markup.STYLES.BOLD, 'strong'),

    // ---- ITALIC ----
    HTMLRule(markup.STYLES.ITALIC, 'em'),

    // ---- STRIKETHROUGH ----
    HTMLRule(markup.STYLES.STRIKETHROUGH, 'del'),

    // ---- IMAGES ----
    HTMLRule(markup.ENTITIES.IMAGE, 'img'),

    // ---- LINK ----
    HTMLRule(markup.ENTITIES.LINK, 'a', function(data) {
        return {
            title: data.title? utils.escape(data.title) : undefined,
            href:  utils.escape(data.href || '')
        };
    }),

    // ---- FOOTNOTE ----
    markup.Rule(markup.ENTITIES.FOOTNOTE_REF)
        .toText(function(state, token) {
            var refname = token.getText();
            return '<sup><a href="#fn_' + refname + '" id="reffn_' + refname + '">' + refname + '</a></sup>';
        }),

    // ---- HTML ----
    markup.Rule(markup.STYLES.HTML)
        .toText(function(state, token) {
            return token.getText();
        })
];
