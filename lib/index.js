var is = require('is');
var find = require('lodash.find');

var rules = require('./rules');
var Range = require('./range');
var BLOCKS = require('./blocks');
var INLINES = require('./inlines');

// Create an instance using a set of rules
function DraftMarkup(syntaxRules) {
    if (!(this instanceof DraftMarkup)) return new DraftMarkup(syntaxRules);

    this.rules = {};

    this.rules.blocks = syntaxRules.blocks.map(rules.compile);
    this.rules.inlines = syntaxRules.inlines.map(rules.compile);
}

// Get rules by IDs
DraftMarkup.prototype.getBlockRule = function getBlockRule(rule) {
    return find(this.rules.blocks, {
        type: rule
    });
};
DraftMarkup.prototype.getInlineRule = function getBlockRule(rule) {
    return find(this.rules.inlines, {
        type: rule
    });
};

// Convert a text into a ContentState for draft-js
DraftMarkup.prototype.toRawContent = function toRawContent(text) {
    var rule, match, block, isIgnored, inline;

    // Context "this" for parsing
    var ctx = {};

    // List of blocks to return
    var blocks = [];

    // Map of entities
    var entityMap = {};

    // Indexing of entities
    var entityId = 0;

    while(text) {
        for (var key in this.rules.blocks) {
            rule = this.rules.blocks[key];
            match = rule.match.call(ctx, text);
            block = undefined;
            isIgnored = (rule.type == BLOCKS.IGNORE);

            if (!match) continue;

            // Create new block
            block = {
                type: rule.type,
                text: match.text,
                raw: match.raw,
                depth: match.depth || 0,
                inlineStyleRanges: [],
                entityRanges: []
            };

            // Parse inline content of this block
            if (rule.parseInline !== false && !isIgnored) {
                inline = this.toInlineStyleRanges(block.text, ctx);
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
                delete entity.entity;

                entityId++;
                return entity;
            });

            // Push new block
            if (!isIgnored) blocks.push(block);

            // Update source text
            text = text.substring(block.raw.length);
            break;
        }

        if (!block) {
            throw new Error('No rule match this text '+JSON.stringify(text));
        }
    }

    return this.postProcess({
        blocks: blocks,
        entityMap: entityMap
    }, ctx);
};

// Convert an inline text into a list of inlineStyleRanges and entities
// it returns an object {ranges,text}
DraftMarkup.prototype.toInlineStyleRanges = function toInlineStyleRanges(text, ctx) {
    var result = '';
    var inlineStyleRanges = [];
    var entityRanges = [];
    var offset = 0;
    var offsetDiff = 0;
    var rule, inlineMatch, inline;

    while(text) {
        for (var key = 0; key < this.rules.inlines.length; key++) {
            rule = this.rules.inlines[key];

            // Is it matching this rule?
            inlineMatch = rule.match.call(ctx, text);
            if (!inlineMatch) continue;

            // Parse inside if rule allows it
            if (rule.parseInline !== false) {
                inline = this.toInlineStyleRanges(inlineMatch.text);

                // Replace text
                inlineMatch.text = inline.text;

                // Index sub-entities / sub-styles
                entityRanges = entityRanges.concat(
                    Range.moveRangesBy(inline.entityRanges, offset + offsetDiff)
                );
                inlineStyleRanges = inlineStyleRanges.concat(
                    Range.moveRangesBy(inline.inlineStyleRanges, offset + offsetDiff)
                );
            }


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
                });

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

// Post process raw content to apply "post" from rules
DraftMarkup.prototype.postProcess = function postProcess(state, ctx) {
    var block, rule;

    for (var i = 0; i < state.blocks.length; i++) {
        block = state.blocks[i];
        rule = this.getBlockRule(block.type);

        if (!rule) throw new Error('Rule not found: ' + block.type);

        block.inlineStyleRanges = this.postProcessStyles(block.text, block.inlineStyleRanges, ctx);
        block.entityRanges = this.postProcessEntities(block.text, block.entityRanges, state.entityMap, ctx);

        if (!rule.post) continue;
        state.blocks[i] = rule.post.call(ctx, block.text, block);
    }

    return state;
};

// Post process inlineStyleRanges
DraftMarkup.prototype.postProcessStyles = function postProcessStyles(text, inlineStyleRanges, ctx) {
    var range, rule;

    for (var i = 0; i < inlineStyleRanges.length; i++) {
        range = inlineStyleRanges[i];
        rule = this.getInlineRule(range.style);

        if (!rule) throw new Error('Rule not found: ' + range.style);
        if (!rule.post) continue;

        rule.post.call(
            ctx,
            text.slice(range.offset, range.offset + range.length),
            range
        );
    }

    return inlineStyleRanges;
};

// Post process entityRanges
DraftMarkup.prototype.postProcessEntities = function postProcessEntities(text, entities, entityMap, ctx) {
    var range, entity, rule;

    for (var i = 0; i < entities.length; i++) {
        range = entities[i];
        entity = entityMap[range.key];
        rule = this.getInlineRule(entity.type);

        if (!rule) throw new Error('Rule not found: ' + entity.type);
        if (!rule.post) continue;

        entityMap[range.key] = rule.post.call(
            ctx,
            text.slice(range.offset, range.offset + range.length),
            entity
        );
    }

    return entities;
};

// Convert a ContentState from draft-js into a string
DraftMarkup.prototype.toText = function toText(state) {
    var block, rule, innerText, next, prev;
    var text = '';

    for (var i = 0; i < state.blocks.length; i++) {
        block = state.blocks[i];
        prev = i > 0? state.blocks[i - 1] : null;
        next = i < (state.blocks.length - 1)? state.blocks[i + 1] : null;

        // Unstyled blocks are just paragraph
        if (block.type == 'unstyled') {
            block.type = 'paragraph';
        }

        // Find rule for processing this block
        rule = this.getBlockRule(block.type);
        if (!rule) throw new Error('No rule for this block: ' + block.type);

        // Generate text according to styles
        if (rule.renderInline !== false) {
            innerText = this.applyInlineRanges(
                block.text,
                block.inlineStyleRanges || [],
                block.entityRanges || [],
                state.entityMap
            );
        } else {
            innerText = block.text;
        }

        text += rule.toText(innerText, block, {
            next: next,
            prev: prev
        });
    }

    return text;
};

// Convert a block content with inlineStyleRanges/entities to text
DraftMarkup.prototype.applyInlineRanges = function applyInlineRanges(text, inlineStyleRanges, entityRanges, entityMap) {
    var range, originalText, newText, rule, entity, ruleType, appliedRanges = [];

    // Copy input
    var result = '' + text;

    var inlineElements = []

        // Linearize styles
        .concat(Range.linearize(inlineStyleRanges))

        // Merge with entities
        .concat(entityRanges);


    for (var i = 0; i < inlineElements.length; i++) {
        range = Range.relativeTo(inlineElements[i], appliedRanges);

        originalText = result.slice(
            range.offset,
            range.offset + range.length
        );

        // Ignore unstyled
        if (range.style == 'unstyled') continue;

        // Is entity?
        entity = is.undefined(range.key)? null : entityMap[range.key];
        ruleType = entity? entity.type : range.style;

        // Find rule for processing this block
        rule = this.getInlineRule(ruleType);
        if (!rule) throw new Error('No rule for this inline element: ' + ruleType);

        // Calcul new text (text + syntax)
        newText = rule.toText(originalText, entity);

        result = result.slice(0, range.offset) + newText + result.slice(range.offset + range.length);

        // Push a new offset changes
        appliedRanges.push(
            Range(range.offset, range.length, {
                value: newText
            })
        );
    }

    return result;
};


module.exports = DraftMarkup;
module.exports.INLINES = INLINES;
module.exports.BLOCKS = BLOCKS;
