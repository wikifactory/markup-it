var Immutable = require('immutable');

var Content = require('../models/content');
var Token = require('../models/token');

/**
 * Decode marks as tokens
 *
 * @param {Array} marks
 * @param {String} text
 * @return {Token}
 */
function decodeMarksAsToken(marks, text) {
    return marks.reduce(function(child, mark) {
        return new Token({
            type:   mark._,
            data:   Immutable.Map(mark).delete('_'),
            tokens: [child]
        });

    }, Token.createInlineText(text));
}

/**
 * Decode a token
 *
 * @paran {Object} json
 * @return {Token}
 */
function decodeTokenFromJSON(json) {
    var tokens;

    if (json.marks) {
        tokens = Immutable.List([
            decodeMarksAsToken(json.marks, json.text)
        ]);
    } else {
        tokens = decodeTokensFromJSON(json.content || []);
    }

    return new Token({
        type:   json.type,
        text:   json.text,
        raw:    json.raw,
        data:   json.attrs,
        tokens: tokens
    });
}

/**
 * Decode a list of tokens
 *
 * @paran {Object} json
 * @return {List<Token>}
 */
function decodeTokensFromJSON(json) {
    return new Immutable.List(json.map(decodeTokenFromJSON));
}

/**
 * Decode a JSON into a Content
 *
 * @paran {Object} json
 * @return {Content}
 */
function decodeContentFromProseMirror(json) {
    return Content.createFromToken(
        'prosemirror',
        decodeTokenFromJSON(json)
    );
}

module.exports = decodeContentFromProseMirror;
