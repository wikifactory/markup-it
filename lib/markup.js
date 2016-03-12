var is = require('is');

var Range = require('./range');
var ParsingSession = require('./parse');

// Create an instance using a set of rules
function DraftMarkup(syntax) {
    if (!(this instanceof DraftMarkup)) return new DraftMarkup(syntax);

    this.syntax = syntax;
}

// Convert a text into a ContentState for draft-js
DraftMarkup.prototype.toRawContent = function toRawContent(text) {
    // Create a new session
    return ParsingSession(this.syntax)

        // Process the text
        .process(text)

        // Return raw content
        .toRawContent();
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
        rule = this.syntax.getBlockRule(block.type);
        if (!rule) throw new Error('No rule for this block: ' + block.type);

        // Generate text according to styles
        if (rule.option('renderInline') !== false) {
            innerText = this.applyInlineRanges(
                block.text,
                block.inlineStyleRanges || [],
                block.entityRanges || [],
                state.entityMap
            );
        } else {
            innerText = block.text;
        }

        text += rule.onContent({}, innerText, block, {
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
        rule = this.syntax.getInlineRule(ruleType);
        if (!rule) throw new Error('No rule for this inline element: ' + ruleType);

        // Calcul new text (text + syntax)
        newText = rule.onContent({}, originalText, entity);

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
