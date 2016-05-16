var Immutable = require('immutable');
var Range = require('range-utils');

var Content = require('../models/content');
var Token = require('../models/token');

var STYLES = require('../constants/styles');

var decodeEntities = require('./decodeEntities');

/*
    Return true if range is an entity

    @param {Range}
    @return {Boolean}
*/
function isRangeEntity(range) {
    return Boolean(range.entity);
}

/*
    Convert a RangeTreeNode to a token

    @param {String}
    @param {RangeTreeNode}
    @return {Token}
*/
function encodeRangeNodeToToken(baseText, range) {
    var innerText = baseText.slice(range.offset, range.offset + range.length);
    var isRange = isRangeEntity(range);

    return new Token({
        type: isRange? range.entity.type : range.style,
        text: innerText,
        data: isRange? range.entity.data : {},
        tokens: range.style == STYLES.TEXT? [] : encodeRangeTreeToTokens(innerText, range.children || [])
    });
}

/*
    Convert a RangeTree to a list of tokens

    @param {String}
    @param {RangeTree}
    @return {List<Token>}
*/
function encodeRangeTreeToTokens(baseText, ranges) {
    ranges = Range.fill(baseText, ranges, {
        style: STYLES.TEXT
    });

    return new Immutable.List(
        ranges.map(function(range) {
            return encodeRangeNodeToToken(baseText, range);
        })
    );
}

/*
    Convert a ContentBlock into a token

    @param {ContentBlock} block
    @param {Object} entityMap
    @return {Token}
*/
function encodeBlockToToken(block, entityMap) {
    var text = block.text;

    var styleRanges = block.inlineStyleRanges;
    var entityRanges = block.entityRanges;
    var blocks = block.blocks;
    var tokens;

    if (blocks) {
        tokens = decodeDraftBlocksToTokens(blocks, entityMap);
    } else {
        // Unmerge link-image
        entityRanges = decodeEntities(entityRanges, entityMap);

        var allEntities = []
            .concat(entityRanges)
            .concat(styleRanges);

        var tree = Range.toTree(allEntities, isRangeEntity);
        tokens = encodeRangeTreeToTokens(text, tree);
    }

    return new Token({
        type: block.type,
        text: text,
        data: block.data,
        tokens: tokens
    });
}

/**
    Transform a an array of blocks to a list of tokens

    @param {Array<RawContentBlock>} rawBlocks
    @param {Object} entityMap
    @return {List<Token>}
*/
function decodeDraftBlocksToTokens(rawBlocks, entityMap) {
    return Immutable.List(rawBlocks)
    .map(function(block) {
        return encodeBlockToToken(block, entityMap);
    });
}

/**
    Transform a RawContentState from draft into a list of tokens

    @param {RawContentState} rawContentState
    @return {List<Token>}
*/
function decodeDraftToTokens(rawContentState) {
    var blocks = rawContentState.blocks;
    var entityMap = rawContentState.entityMap;

    return decodeDraftBlocksToTokens(blocks, entityMap);
}

/**
    Transform a RawContentState from draft into a Content instance

    @param {RawContentState} rawContentState
    @param {String} syntaxName
    @return {Content}
*/
function decodeDraftToContent(rawContentState, syntaxName) {
    syntaxName = syntaxName || 'draft-js';
    var tokens = decodeDraftToTokens(rawContentState);

    return Content.createFromTokens(syntaxName, tokens);
}


module.exports = decodeDraftToContent;
