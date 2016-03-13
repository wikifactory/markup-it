var is = require('is');
var Range = require('./range');
var INLINES = require('./inlines');

function OutputSession(syntax) {
    if (!(this instanceof OutputSession)) return new OutputSession(syntax);

    this.syntax = syntax;

    // Dump of rawContent
    this.blocks = [];
    this.entityMap = {};

    // Text for output
    this.text = '';
}


// Dump everything as RawContentState
OutputSession.prototype.toText = function toText() {
    return this.text;
};

// Process a text using a set of rules
OutputSession.prototype.process = function process(rawContent) {
    var block, rule, innerText, next, prev;

    this.blocks = rawContent.blocks;
    this.entityMap = rawContent.entityMap;

    for (var i = 0; i < this.blocks.length; i++) {
        block = this.blocks[i];
        prev = i > 0? this.blocks[i - 1] : null;
        next = i < (this.blocks.length - 1)? this.blocks[i + 1] : null;

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
                block.entityRanges || []
            );
        } else {
            innerText = block.text;
        }

        this.text += rule.onContent({}, innerText, block, {
            next: next,
            prev: prev
        });
    }

    return this;
};


// Convert a block content with inlineStyleRanges/entities to text
OutputSession.prototype.applyInlineRanges = function applyInlineRanges(text, inlineStyleRanges, entityRanges) {
    var range, originalText, newText, rule, entity, ruleType, appliedRanges = [];

    // Copy input
    var result = '' + text;


    // Linearized and fill style
    inlineStyleRanges = Range.linearize(inlineStyleRanges);
    inlineStyleRanges = Range.fill(text, inlineStyleRanges, {
        style: INLINES.TEXT
    });

    var inlineElements = []
        .concat(inlineStyleRanges)
        .concat(entityRanges);

    for (var i = 0; i < inlineElements.length; i++) {
        range = Range.relativeTo(inlineElements[i], appliedRanges);

        originalText = result.slice(
            range.offset,
            range.offset + range.length
        );

        // Is entity?
        entity = is.undefined(range.key)? null : this.entityMap[range.key];
        ruleType = entity? entity.type : range.style;

        // Find rule for processing this block
        rule = this.syntax.getInlineRule(ruleType);
        if (!rule) continue;

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


module.exports = OutputSession;
