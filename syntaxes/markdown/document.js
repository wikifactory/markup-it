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
    if (token.getType() !== MarkupIt.ENTITIES.LINK) {
        return token;
    }

    var data = token.getData();

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

    data = data.merge(ref);
    return token.setData(data);
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
