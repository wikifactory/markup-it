var Immutable = require('immutable');
var Range = require('range-utils');

var Content = require('../models/content');
var Token = require('../models/token');

var STYLES = require('../constants/styles');
var ENTITIES = require('../constants/entities');

/*
    Convert a ContentBlock into a token

    @param {ContentBlock} block
    @param {Object} entityMap
    @return {Token}
*/
function encodeBlockToToken(block, entityMap) {
    var text = block.text;
    var tokens = new Immutable.List();

    var styleRanges = block.inlineStyleRanges;
    var entityRanges = block.entityRanges;

    styleRanges = Range.linearize(styleRanges);
    styleRanges = Range.fill(text, styleRanges, {
        style: STYLES.TEXT
    });

    // Unmerge link-image
    entityRanges = entityRanges.reduce(function(result, range) {
        if (range.key) {
            range.entity = entityMap[range.key];
            delete range.key;
        }

        if (!range.entity || range.entity.type != ENTITIES.LINK_IMAGE) {
            result.push(range);
            return result;
        }

        result.push(Range(range.offset, range.length, {
            entity: {
                type: ENTITIES.IMAGE,
                data: {
                    src: range.entity.data.src,
                    title: range.entity.data.imageTitle
                }
            }
        }));
        result.push(Range(range.offset, range.length, {
            entity: {
                type: ENTITIES.LINK,
                data: {
                    href: range.entity.data.href,
                    title: range.entity.data.linkTitle
                }
            }
        }));

        return result;
    }, []);

    // Build list of tokens
    text = Range.reduceText(text, [
        styleRanges,
        entityRanges
    ], function(rangeText, range) {
        var token;

        if (range.entity) {
            token = Token({
                type: range.entity.type,
                data: range.entity.data,
                text: rangeText
            });
        } else {
            token = Token({
                type: range.style,
                text: rangeText
            });
        }

        tokens = tokens.push(token);

        return rangeText;
    });

    return new Token({
        type: block.type,
        text: text,
        data: block.data,
        tokens: tokens
    });
}


/*
    Transform a RawContentState from draft into a Content instance

    @param {RawContentState} rawContentState
    @param {String} syntaxName
    @return {Content}
*/
function decodeDraftToContent(rawContentState, syntaxName) {
    syntaxName = syntaxName || 'draft-js';

    var blocks = rawContentState.blocks;
    var entityMap = rawContentState.entityMap;

    var tokens = new Immutable.List();

    blocks.forEach(function(block) {
        var token = encodeBlockToToken(block, entityMap);
        tokens = tokens.push(token);
    });

    return Content.createFromTokens(syntaxName, tokens);
}


module.exports = decodeDraftToContent;
