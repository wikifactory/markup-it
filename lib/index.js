var is = require('is');
var find = require('lodash.find');

var rules = require('./rules');
var MarkupUtils = require('./utils');

var BLOCKS = require('./blocks');
var INLINES = require('./inlines');


function DraftText(syntaxRules) {
    this.rules = {};

    this.rules.blocks = syntaxRules.blocks.map(rules.compile);
    this.rules.inlines = syntaxRules.inlines.map(rules.compile);
}

// Convert a text into a ContentState for draft-js
DraftText.prototype.toRawContent = function toRawContent(text) {
    var rule, match, raw, block;
    var blocks = [];
    var entityMap = {};
    var entityId = 0;

    while(text) {
        for (var key in this.rules.blocks) {
            rule = this.rules.blocks[key];
            match = rule.match(text);
            block = undefined;

            if (!match) continue;

            // Create new block
            block = {
                type: rule.type,
                text: match.text,
                raw: match.raw,
                inlineStyleRanges: [],
                entityRanges: []
            };

            // Parse inline content of this block
            if (rule.inline !== false) {
                var inline = this.toInlineStyleRanges(block.text);
                block.text = inline.text;
                block.inlineStyleRanges = inline.inlineStyleRanges;
                block.entityRanges = inline.entityRanges;
            }

            // Add entities from block match (example: code blocks with fences)
            if (match.entityRanges) {
                block.entityRanges = block.entityRanges.concat(match.entityRanges);
            }

            // Index all entities, since entityRanges return by "toInlineStyleRanges" contains all the data
            block.entityRanges = block.entityRanges.map(function(entity) {
                entity.key = 'entity' + entityId;
                entityMap[entity.key] = entity.entity;
                delete entity.entity

                entityId++;
                return entity;
            })

            // Push new block
            blocks.push(block);

            // Update source text
            text = text.substring(block.raw.length);
            break;
        }

        if (!block) {
            throw new Error('No rule match this text');
        }
    }

    return {
        blocks: blocks,
        entityMap: entityMap
    };
};

// Convert an inline text into a list of inlineStyleRanges and entities
// it returns an object {ranges,text}
DraftText.prototype.toInlineStyleRanges = function toInlineStyleRanges(text) {
    var result = '';
    var inlineStyleRanges = [];
    var entityRanges = [];
    var offset = 0;
    var offsetDiff = 0;
    var rule, inlineMatch;

    while(text) {
        for (var key = 0; key < this.rules.inlines.length; key++) {
            rule = this.rules.inlines[key];

            // Is it matching this rule?
            inlineMatch = rule.match(text);
            if (!inlineMatch) continue;


            if (inlineMatch.type == 'unstyled') {
                // Don't push style for type "unstyled"
            } else if (inlineMatch.data) {
                // Entity ?
                entityRanges.push({
                    length: inlineMatch.text.length,
                    offset: offset + offsetDiff,
                    entity: {
                        type: inlineMatch.type,
                        data: inlineMatch.data,
                        mutability: inlineMatch.mutability || 'MUTABLE'
                    }
                })

            } else {
                // Style ?
                inlineStyleRanges.push({
                    length: inlineMatch.text.length,
                    offset: offset + offsetDiff,
                    style: inlineMatch.type
                });
            }

            // Append to output
            result += inlineMatch.text;

            // Calcul new offset
            offset += inlineMatch.raw.length;
            offsetDiff += (inlineMatch.text.length - inlineMatch.raw.length);

            // Update source text
            text = text.substring(inlineMatch.raw.length);

            break;
        }

        if (!inlineMatch) {
            throw new Error('No rule match this text');
        }
    }

    return {
        text: result,
        inlineStyleRanges: inlineStyleRanges,
        entityRanges: entityRanges
    };
};

// Convert a ContentState from draft-js into a string
DraftText.prototype.toText = function toText(state) {
    var block, rule, innerText;
    var text = '';

    for (var i = 0; i < state.blocks.length; i++) {
        block = state.blocks[i];

        // Unstyled blocks are just paragraph
        if (block.type == 'unstyled') {
            block.type = 'paragraph';
        }

        // Find rule for processing this block
        rule = find(this.rules.blocks, {
            type: block.type
        });
        if (!rule) throw new Error('No rule for this block: ' + block.type);

        // Generate text according to styles
        if (rule.inline !== false) {
            innerText = this.applyInlineRanges(
                block.text,
                block.inlineStyleRanges || [],
                block.entityRanges || [],
                state.entityMap
            );
        } else {
            innerText = block.text;
        }

        text += rule.toText(innerText);
    }

    return text;
};

// Convert a block content with inlineStyleRanges/entities to text
DraftText.prototype.applyInlineRanges = function applyInlineRanges(text, inlineStyleRanges, entityRanges, entityMap) {
    var range, originalText, newText, rule, entity, ruleType,
        offsetDiff, offsetRanges = [];

    // Copy input
    var result = '' + text;

    var inlineElements = [].concat(inlineStyleRanges).concat(entityRanges);

    for (var i = 0; i < inlineElements.length; i++) {
        range = inlineElements[i];
        originalText = text.slice(range.offset, range.offset + range.length);

        // Ignore unstyled
        if (range.style == 'unstyled') continue;

        // Is entity?
        entity = is.undefined(range.key)? null : entityMap[range.key];
        ruleType = entity? entity.type : range.style;

        // Find rule for processing this block
        rule = find(this.rules.inlines, {
            type: ruleType
        });
        if (!rule) throw new Error('No rule for this inline element: ' + ruleType);

        // Calcul new text (text + syntax)
        newText = rule.toText(originalText, entity);

        // Calcul offset
        offsetDiff = calculOffsetDiff(offsetRanges, range.offset);

        result = result.slice(0, range.offset + offsetDiff) + newText + result.slice(range.offset + offsetDiff + range.length);

        // Push a new offset changes
        offsetRanges.push({
            offset: range.offset,
            value: (newText.length - originalText.length),
            length: newText.length
        });

        // Calcul difference in offsetting
        offsetDiff += (newText.length - originalText.length);
    }

    return result;
};

// Calcul offset difference at a specific index
function calculOffsetDiff(ranges, index) {
    var range, offsetDiff = 0;

    for (var i = 0; i < ranges.length; i++) {
        range = ranges[i];

        if (index < range.offset) break;

        offsetDiff += range.value;
    }

    return offsetDiff;
}

module.exports = DraftText;
module.exports.Utils = MarkupUtils;
module.exports.INLINES = INLINES;
module.exports.BLOCKS = BLOCKS;
