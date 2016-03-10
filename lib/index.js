var find = require('lodash.find');

var rules = require('./rules');

var BLOCKS = require('./blocks');
var INLINES = require('./inlines');


function Syntax(syntaxRules) {
    this.rules = {};

    this.rules.blocks = syntaxRules.blocks.map(rules.compile);
    this.rules.inlines = syntaxRules.inlines.map(rules.compile);
}

// Convert a text into a ContentState for draft-js
Syntax.prototype.toRawContent = function toRawContent(text) {
    var rule, match, raw, block;
    var blocks = [];

    while(text) {
        for (var key in this.rules.blocks) {
            rule = this.rules.blocks[key];
            block = rule.match(text);
            if (!block) continue;

            // Parse inline in it
            var inline = this.toCharacters(block.text);
            block.text = inline.text;
            block.characterList = inline.characterList;

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
        blocks: blocks
    };
};

// Convert an inline text into a list of entities
// it returns an object {characters,text}
Syntax.prototype.toCharacters = function toEntities(text) {
    var out = '';
    var characters = [];

    while(text) {
        for (var key in this.rules.inlines) {
            rule = this.rules.inlines[key];
            character = rule.match(text);
            if (!character) continue;

            // Push styles
            for (var i in character.text) {
                characters.push([character.type]);
            }

            out = out + character.text;

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
        characterList: characters
    };
};

// Convert a ContentState from draft-js into a string
Syntax.prototype.toText = function toText(state) {
    var block, rule, innerText;
    var text = '';

    for (var i in state.blocks) {
        block = state.blocks[i];

        // Find rule for processing this block
        rule = find(this.rules.blocks, {
            type: block.type
        });
        if (!rule) throw new Error('No rule for this block');

        // Generate text according to styles
        innerText = block.text;
        // todo

        text += rule.toText(innerText);
    }

    return text;
};

module.exports = {
    Syntax: Syntax,
    BLOCKS: BLOCKS,
    INLINES: INLINES
};
