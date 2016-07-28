var Immutable = require('immutable');
var KINDS = require('./KINDS');
var MARK_TYPES = require('./markTypes');

/**
 * Encode an inline token
 * @param {Token} tokens
 * @param {List<Mark>}
 * @return {Array<Object>}
 */
function encodeInlineTokenToNodes(token, marks) {
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
            return accu.concat(encodeInlineTokenToNodes(token, innerMarks));
        }, []);
}

/**
 * Encode a block token
 * @param {Token} tokens
 * @return {Array<Object>}
 */
function encodeBlockTokenToNode(token, marks) {
    return {
        kind:  token.isBlock()? KINDS.BLOCK : KINDS.INLINE,
        type:  token.getType(),
        data:  token.getData().toJS(),
        nodes: encodeTokensToNodes(token.getTokens())
    };
}

/**
 * Encode a token to a Slate node
 *
 * @param {Token} token
 * @return {Object}
 */
function encodeTokenToNodes(token) {
    if (token.isText() || MARK_TYPES.includes(token.getType())) {
        return encodeInlineTokenToNodes(token);
    }

    return [encodeBlockTokenToNode(token)];
}


/**
 * Encode a list of tokens to JSON Nodes
 *
 * @param {List<Token>} tokens
 * @return {Array<Object>}
 */
function encodeTokensToNodes(tokens) {
    return tokens.reduce(function(accu, token) {
        return accu.concat(encodeTokenToNodes(token));
    }, []);
}

/**
 * Encode a Content into a Slate Raw JSON object
 *
 * @param {Content} content
 * @return {Object}
 */
function encodeContentToSlate(content) {
    var node = encodeBlockTokenToNode(content.getToken());
    return {
        nodes: node.nodes
    };
}

module.exports = encodeContentToSlate;
