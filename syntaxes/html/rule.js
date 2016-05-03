var is = require('is');

var markup = require('../../');
var identity = require('../../lib/utils/identity');

var SINGLE_TAG = ['img', 'hr'];

function attrsToString(attrs) {
    var output = '', value;

    for (var key in attrs) {
        value = attrs[key];
        if (is.undefined(value) || is.null(value) || (is.string(value) && !value)) {
            continue;
        }

        output += ' ' + key + '=' + JSON.stringify(value);
    }

    return output;
}

function HTMLRule(type, tag, getAttrs) {
    getAttrs = getAttrs || identity;
    var isSingleTag = SINGLE_TAG.indexOf(tag) >= 0;

    return markup.Rule(type)
        .toText(function(text, token) {
            var attrs = getAttrs(token.data, token);
            var output = '<' + tag + attrsToString(attrs) + (isSingleTag? '/>' : '>');

            if (!isSingleTag) {
                output += text;
                output += '</' + tag + '>';
            }

            return output;
        });
}

module.exports = HTMLRule;
