var Range = require('range-utils');

var walk = require('../utils/walk');
var isEntity = require('../utils/isEntity');
var STYLES = require('../constants/styles');
var BLOCKS = require('../constants/blocks');

var getMutability = require('./getMutability');

/*
    Encode an entity from a token

    @param {Token} token
    @return {Object<Entity>}
*/
function encodeTokenToEntity(token) {
    return {
        type: token.getType(),
        mutability: getMutability(token),
        data: token.getData().toJS()
    };
}

/*
    Encode a token into a ContentBlock

    @param {Token} token
    @return {Object<ContentBlock>}
*/
function encodeTokenToBlock(token, registerEntity) {
    var tokenType = token.getType();
    var inlineStyleRanges = [];
    var entityRanges = [];

    var innerText = walk(token, function(tok, range) {
        if (isEntity(tok)) {
            var entity = encodeTokenToEntity(tok);
            var entityKey = registerEntity(entity);

            entityRanges.push(
                Range(
                    range.offset,
                    range.length,
                    {
                        key: entityKey
                    }
                )
            );

        } else if (tok.getType() != STYLES.TEXT) {
            inlineStyleRanges.push(
                Range(
                    range.offset,
                    range.length,
                    {
                        style: tok.getType()
                    }
                )
            );
        }
    });

    return {
        type: tokenType == BLOCKS.UNSTYLED? BLOCKS.PARAGRAPH : tokenType,
        text: innerText,
        inlineStyleRanges: inlineStyleRanges,
        entityRanges: entityRanges
    };
}

/*
    Encode a Content instance into a RawContentState for draft

    @paran {Content} content
    @return {Object<RawContentState>}
*/
function encodeToDraft(content) {
    var entityKey = 0;
    var entityMap = {};

    var blockTokens = content.getTokens();

    // Register an entity and returns its key/ID
    function registerEntity(entity) {
        entityKey++;
        entityMap[entityKey] = entity;

        return entityKey;
    }

    return {
        blocks: blockTokens.map(function(token) {
            return encodeTokenToBlock(token, registerEntity);
        }).toJS(),
        entityMap: entityMap
    };
}



module.exports = encodeToDraft;
