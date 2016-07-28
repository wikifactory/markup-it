var Immutable = require('immutable');
var KINDS = require('./KINDS');
var MARK_TYPES = require('./markTypes');

/**
 * Encode an inline token
 * @param {Token} tokens
 * @param {List<Mark>}
 * @return {Array<Object>}
 */
function encodeInlineTokenToNode(token, marks) {
    marks = marks || Immutable.List();

    if (!MARK_TYPES.includes(token.getType())) {
        return [
            {
                kind: KINDS.TEXT,
                text: token.getText(),
                marks: marks.toJS()
            }
        ];
    }

    var mark = {
        type: token.getType(),
        data: token.getData().toJS()
    };
    var innerMarks = marks.push(mark);
    var tokens     = token.getTokens();

    return tokens
        .reduce(function(accu, token) {
            return accu.concat(encodeInlineTokenToNode(token, innerMarks));
        }, []);
}

/**
 * Encode a token to a Slate node
 *
 * @param {Token} token
 * @return {Object}
 */
function encodeTokenToNode(token) {
    if (token.isText() || MARK_TYPES.includes(token.getType())) {
        return encodeInlineTokenToNode(token);
    }

    return {
        kind:  token.isBlock()? KINDS.BLOCK : KINDS.INLINE,
        type:  token.getType(),
        data:  token.getData().toJS(),
        nodes: token.getTokens().map(encodeTokenToNode).toJS()
    };
}

/**
 * Encode a Content into a Slate Raw JSON object
 *
 * @param {Content} content
 * @return {Object}
 */
function encodeContentToSlate(content) {
    var node = encodeTokenToNode(content.getToken());
    return {
        nodes: node.nodes
    };
}

module.exports = encodeContentToSlate;
