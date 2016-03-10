var find = require('lodash.find');

var rules = require('./rules');

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

    while(text) {
        for (var key in this.rules.blocks) {
            rule = this.rules.blocks[key];
            block = rule.match(text);
            if (!block) continue;

            // Parse inline in it
            if (rule.inline !== false) {
                var inline = this.toInlineStyleRanges(block.text);
                block.text = inline.text;
                block.inlineStyleRanges = inline.ranges;
            } else {
                block.inlineStyleRanges = [];
            }

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
        entityMap: {}
    };
};

// Convert an inline text into a list of entities
// it returns an object {ranges,text}
DraftText.prototype.toInlineStyleRanges = function toInlineStyleRanges(text) {
    var out = '';
    var ranges = [];
    var offset = 0;
    var offsetDiff = 0;
    var rule, character;

    while(text) {
        for (var key in this.rules.inlines) {
            rule = this.rules.inlines[key];

            // Is it matching this rule?
            character = rule.match(text);
            if (!character) continue;

            // Push a new range
            ranges.push({
                length: character.text.length,
                offset: offset + offsetDiff,
                style: character.type
            });

            out = out + character.text;

            // Calcul new offset
            offset += character.raw.length;
            offsetDiff += (character.text.length - character.raw.length);

            // Update source text
            text = text.substring(character.raw.length);
            break;
        }

        if (!character) {
            throw new Error('No rule match this text');
        }
    }

    return {
        text: out,
        ranges: ranges
    };
};

// Convert a ContentState from draft-js into a string
DraftText.prototype.toText = function toText(state) {
    var block, rule, innerText;
    var text = '';

    for (var i in state.blocks) {
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
            innerText = this.applyInlineStyleRanges(block.text, block.inlineStyleRanges || []);
        } else {
            innerText = block.text;
        }

        text += rule.toText(innerText);
    }

    return text;
};

// Convert a block content with inlineStyleRanges to text
DraftText.prototype.applyInlineStyleRanges = function applyInlineStyleRanges(text, inlineStyleRanges) {
    var range, originalText, newText, rule, offsetDiff, offsetRanges = [];

    // Copy input
    var result = '' + text;

    for (var i in inlineStyleRanges) {
        range = inlineStyleRanges[i];
        originalText = text.slice(range.offset, range.offset + range.length);

        // Find rule for processing this block
        rule = find(this.rules.inlines, {
            type: range.style
        });
        if (!rule) throw new Error('No rule for this inline style: ' + range.style);

        // Calcul new text (text + syntax)
        newText = rule.toText(originalText);

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

    for (var i in ranges) {
        range = ranges[i];

        if (index < range.offset) break;

        offsetDiff += range.value;
    }

    return offsetDiff;
}

module.exports = DraftText;
module.exports.INLINES = INLINES;
module.exports.BLOCKS = BLOCKS;
