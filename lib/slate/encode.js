var Immutable = require('immutable');

var BLOCKS = require('../constants/blocks');
var ENTITIES = require('../constants/entities');
var KINDS = require('./KINDS');
var MARK_TYPES = require('./markTypes');

var VOID_NODES = Immutable.List([
    ENTITIES.IMAGE, ENTITIES.FOOTNOTE_REF, BLOCKS.HR
]);

/**
 * Return true if a token is void node
 * @param {Token} token
 * @return {Boolean}
 */
function isVoid(token) {
    return VOID_NODES.indexOf(token.getType()) >= 0;
}

/**
 * Encode a text token to JSON
 * @param {Token} token
 * @param {List<JSONMark>}
 * @return {Array<JSONNode>}
 */
function encodeTextTokenToNodes(token, marks) {
    return [
        {
            kind: KINDS.TEXT,
            text: token.getText(),
            marks: marks.toJS()
        }
    ];
}

/**
 * Encode an inline token
 * @param {Token} token
 * @param {List<JSONMark>}
 * @return {Array<JSONNode>}
 */
function encodeInlineTokenToNodes(token, marks) {
    marks = marks || Immutable.List();

    // var isMark = MARK_TYPES.includes(token.getType());

    if (token.isText()) {
        return encodeTextTokenToNodes(token, marks);
    }

    marks = marks.push({
        type: token.getType(),
        data: token.getData().toJS()
    });

    return token.getTokens()
        .reduce(function(accu, token) {
            var innerTokens = encodeTokenToNodes(token, marks);
            return accu.concat(innerTokens);
        }, []);
}

/**
 * Encode a token (block or inline) to a Slate node.
 *
 * @param {Token} token
 * @param {List<JSONMark>} marks
 * @return {Array<JSONNode>} nodes
 */
function encodeTokenToNodes(token, marks) {
    if (token.isText() || MARK_TYPES.includes(token.getType())) {
        return encodeInlineTokenToNodes(token, marks);
    }

    return [
        {
            kind:   token.isBlock()? KINDS.BLOCK : KINDS.INLINE,
            type:   token.getType(),
            data:   token.getData().toJS(),
            isVoid: isVoid(token),
            nodes:  encodeTokensToNodes(token.getTokens(), marks)
        }
    ];
}


/**
 * Encode a list of tokens to JSON Nodes
 *
 * @param {List<Token>} tokens
 * @param {List<JSONMark>} marks
 * @return {Array<JSONNode>} nodes
 */
function encodeTokensToNodes(tokens, marks) {
    return tokens.reduce(function(accu, token) {
        return accu.concat(encodeTokenToNodes(token, marks));
    }, []);
}

/**
 * Encode a Content into a Slate Raw JSON object
 *
 * @param {Content} content
 * @return {JSONDoc} doc
 */
function encodeContentToSlate(content) {
    var nodes = encodeTokenToNodes(content.getToken());
    var doc = nodes[0];

    return {
        nodes: doc.nodes
    };
}

module.exports = encodeContentToSlate;
