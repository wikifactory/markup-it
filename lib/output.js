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
    var block, rule, innerText, next, prev, entity;

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

        // Extract entity if block has metatdata
        entity = block.blockEntity? this.entityMap[block.blockEntity] : null;

        this.text += rule.onContent({}, innerText, entity, {
            depth: block.depth,
            next: next,
            prev: prev
        });
    }

    return this;
};


// Convert a block content with inlineStyleRanges/entities to text
OutputSession.prototype.applyInlineRanges = function applyInlineRanges(text, inlineStyleRanges, entityRanges) {
    // Linearize and fill styles
    inlineStyleRanges = Range.linearize(inlineStyleRanges);
    inlineStyleRanges = Range.fill(text, inlineStyleRanges, {
        style: INLINES.TEXT
    });

    return Range.reduceText(text, [
        inlineStyleRanges,
        entityRanges
    ], this.applyEntity.bind(this));
};

// Apply an entity to a text and return the output
OutputSession.prototype.applyEntity = function transform(originalText, range) {
    // Is entity?
    var entity = is.undefined(range.key)? null : this.entityMap[range.key];
    var ruleType = entity? entity.type : range.style;

    // Find rule for processing this block
    var rule = this.syntax.getInlineRule(ruleType);
    if (!rule) return originalText;

    // Calcul new text (text + syntax)
    return rule.onContent({}, originalText, entity);
};

module.exports = OutputSession;
