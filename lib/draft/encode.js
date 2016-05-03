var Range = require('range-utils');

var walk = require('../utils/walk');
var getMutability = require('./getMutability');

var ENTITIES = require('../constants/entities');
var STYLES = require('../constants/styles');
var BLOCKS = require('../constants/blocks');

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
    var blocks = [];

    var innerText = walk(token, function(tok, range) {
        if (tok.isBlock()) {
            blocks.push(encodeTokenToBlock(tok, registerEntity));
        } else if (tok.isEntity()) {
            var entity = encodeTokenToEntity(tok);

            entityRanges.push(
                Range(
                    range.offset,
                    range.length,
                    {
                        entity: entity
                    }
                )
            );

        } else if (tok.getType() !== STYLES.TEXT) {
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

    // Linearize/Merge ranges (draft-js doesn't support multiple entities on the same range)
    entityRanges = Range.merge(entityRanges, function(a, b) {
        if (
            (a.entity.type == ENTITIES.IMAGE || a.entity.type == ENTITIES.LINK) &&
            (b.entity.type == ENTITIES.IMAGE || b.entity.type == ENTITIES.LINK) &&
            (a.entity.type !== b.entity.type)
        ) {
            var img =  ((a.entity.type == ENTITIES.IMAGE)? a : b).entity.data;
            var link =  ((a.entity.type == ENTITIES.LINK)? a : b).entity.data;

            return Range(a.offset, a.length, {
                entity: {
                    type: ENTITIES.LINK_IMAGE,
                    mutability: getMutability(ENTITIES.LINK_IMAGE),
                    data: {
                        src: img.src,
                        href: link.href,
                        imageTitle: img.title,
                        linkTitle: link.title
                    }
                }
            });
        }

        return a;
    });

    // Register all entities
    entityRanges = entityRanges.map(function(range) {
        var entityKey = registerEntity(range.entity);

        return Range(range.offset, range.length, {
            key: entityKey
        });
    });

    // Metadata for this blocks
    var data = token.getData().toJS();
    if (blocks.length > 0) {
        data.blocks = blocks;
    }

    return {
        type: tokenType == BLOCKS.UNSTYLED? BLOCKS.PARAGRAPH : tokenType,
        text: innerText,
        data: data,
        inlineStyleRanges: inlineStyleRanges,
        entityRanges: entityRanges
    };
}

/*
    Encode a Content instance into a RawContentState for draft

    @paran {Content} content
    @return {Object<RawContentState>}
*/
function encodeContentToDraft(content) {
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



module.exports = encodeContentToDraft;
