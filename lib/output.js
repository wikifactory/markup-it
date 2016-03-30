var is = require('is');
var Range = require('./range');
var STYLES = require('./constants/styles');
var ENTITIES = require('./constants/entities');

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

        this.text += rule.onContent({}, innerText, {
            data: block.data || {},
            depth: block.depth,
            next: next,
            prev: prev
        });
    }

    return this;
};

// Convert a block content with inlineStyleRanges/entities to text
OutputSession.prototype.applyInlineRanges = function applyInlineRanges(text, inlineStyleRanges, entityRanges) {
    var that = this;

    // Linearize and fill styles
    inlineStyleRanges = Range.linearize(inlineStyleRanges);
    inlineStyleRanges = Range.fill(text, inlineStyleRanges, {
        style: STYLES.TEXT
    });

    // Unmerge link-image
    entityRanges = entityRanges.reduce(function(result, range) {
        if (range.key) {
            range.entity = that.entityMap[range.key];
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

    return Range.reduceText(text, [
        inlineStyleRanges,
        entityRanges
    ], this.applyInlineRange.bind(this));
};

// Apply an entity to a text and return the output
OutputSession.prototype.applyInlineRange = function transform(originalText, range) {
    // Is entity?
    var entity = range.entity;
    var ruleType = entity? entity.type : range.style;

    // Find rule for processing this block
    var rule = this.syntax.getInlineRule(ruleType);
    if (!rule) return originalText;

    // Calcul new text (text + syntax)
    return rule.onContent({}, originalText, entity);
};

module.exports = OutputSession;
