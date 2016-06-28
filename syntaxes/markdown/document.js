var Immutable = require('immutable');
var MarkupIt = require('../../');

/**
 * Cleanup a text before parsing: normalize newlines and tabs
 *
 * @param {String} src
 * @return {String}
 */
function cleanupText(src) {
    return src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n')
    .replace(/^ +$/gm, '');
}

/**
 * Resolve definition links
 *
 * @param {ParsingState} state
 * @param {Token} token
 * @return {Token}
 */
function resolveLink(state, token) {
    var tokenType = token.getType();
    var data      = token.getData();

    if (tokenType === 'definition') {
        return false;
    }
    if (tokenType !== MarkupIt.ENTITIES.LINK) {
        return token;
    }

    // Normal link
    if (!data.has('ref')) {
        return token;
    }

    // Resolve reference
    var refs = (state.refs || {});
    var refId = data.get('ref')
        .replace(/\s+/g, ' ')
        .toLowerCase();
    var ref = refs[refId];

    // Parse reference as text
    if (!ref) {
        var rawText = token.getRaw();

        var tokens = Immutable.List([
            MarkupIt.Token.createText(rawText[0])
        ])
        .concat(
            state.parseAsInline(rawText.slice(1))
        );

        return MarkupIt.transform(tokens, resolveLink.bind(null, state));
    }

    // Update link attributes
    return token.setData(
        data.merge(ref)
    );
}

var documentRule = MarkupIt.Rule(MarkupIt.BLOCKS.DOCUMENT)
    .match(function(state, text) {
        text = cleanupText(text);

        var token = MarkupIt.Token.create(MarkupIt.BLOCKS.DOCUMENT, {
            tokens: state.parseAsBlock(text)
        });

        return MarkupIt.transform(token, resolveLink.bind(null, state));
    })
    .toText(function(state, token) {
        return state.renderAsBlock(token);
    });

module.exports = documentRule;
