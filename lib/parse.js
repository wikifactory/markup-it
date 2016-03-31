var BLOCKS = require('./constants/blocks');
var ENTITIES = require('./constants/entities');
var defaults = require('./defaults');
var Range = require('./range');
var Entity = require('./entity');

/*
    ParsingSession instance represents
    one transformation from Text to ContentState
*/

function ParsingSession(syntax, ctx) {
    if (!(this instanceof ParsingSession)) return new ParsingSession(syntax, ctx);

    this.syntax = syntax;

    // Shared context for all rules during this session
    // Rules can store variables in it
    this.ctx = ctx || {};

    this.ctx.createParsingSession = function() {
        return new ParsingSession(syntax, {});
    };

     // Map of entities
    this.entityMap = {};

    // List of blocks to return
    this.blocks = [];

    // Indexing of entities
    this.entityId = 0;

    // Text content not parsed
    this.nonParsed = '';
}

// Dump everything as RawContentState
ParsingSession.prototype.toRawContent = function toRawContent() {
    return {
        blocks: this.blocks,
        entityMap: this.entityMap
    };
};

// Process a text using a set of rules
ParsingSession.prototype.process = function process(text) {
    var match, rule, rules;

    rules = this.syntax.blocks.toArray();

    while(text) {
        for (var key = 0; key < rules.length; key++) {
            rule = rules[key];
            match = rule.onText(this.ctx, text);

            if (!match) continue;

            this.pushNonParsed();

            // Create new block
            this.pushBlock(rule, {
                text: match.text,
                depth: match.depth,
                entityRanges: match.entityRanges,
                data: match.data
            });

            // Update source text
            text = text.substring(match.raw.length);
            break;
        }

        // Nothing match this block, we move to the next character and try again
        // When found, we add a new block "PARAGRAPH"
        if (!match) {
            this.nonParsed += text[0];
            text = text.substring(1);
        }
    }

    // Something non-parsed at the end?
    this.pushNonParsed();

    // Post process result
    this.postProcess();

    return this;
};

// Push a new block to the set
ParsingSession.prototype.pushBlock = function pushBlock(rule, block) {
    var inline, isIgnored = (rule.type == BLOCKS.IGNORE);

    // Default properties of the block
    block.type = block.type || rule.type;
    block.depth = block.depth || 0;
    block.entityRanges = block.entityRanges || [];
    block.inlineStyleRanges = block.inlineStyleRanges || [];

    // Parse inline content of this block
    if (rule.option('parseInline') !== false && !isIgnored) {
        inline = this.toInlineStyleRanges(block.text);

        block.text = inline.text;
        block.inlineStyleRanges = inline.inlineStyleRanges;
        block.entityRanges = block.entityRanges.concat(inline.entityRanges);
    }

    // Linearize/Merge ranges (draft-js doesn't support multiple entities on the same range)
    block.entityRanges = Range.merge(block.entityRanges, function(a, b) {
        if (
            (a.entity.type == ENTITIES.IMAGE || a.entity.type == ENTITIES.LINK) &&
            (b.entity.type == ENTITIES.IMAGE || b.entity.type == ENTITIES.LINK) &&
            (a.entity.type !== b.entity.type)
        ) {
            var img =  ((a.entity.type == ENTITIES.IMAGE)? a : b).entity.data;
            var link =  ((a.entity.type == ENTITIES.LINK)? a : b).entity.data;

            return Range(a.offset, a.length, {
                entity: {
                    type: ENTITIES.LINK_IMAGE,
                    mutability: Entity.IMMUTABLE,
                    data: {
                        src: img.src,
                        href: link.href,
                        imageTitle: img.title,
                        linkTitle: link.title
                    }
                }
            });
        }

        return a;
    });

    // Index all entities, since entityRanges return by "toInlineStyleRanges" contains all the data
    block.entityRanges = block.entityRanges.map(this.indexInlineEntity.bind(this));

    // Push new block
    if (!isIgnored) {
        this.blocks.push(block);
    }

    return block;
};

// Push a new block for the content non-parsed
ParsingSession.prototype.pushNonParsed = function pushNonParsed() {
    if (!this.nonParsed) return;

    this.pushBlock(defaults.blockRule, {
        text: this.nonParsed
    });

    // Reset non-parsed block
    this.nonParsed = '';
};

// Index an entity and returns its key
ParsingSession.prototype.indexEntity = function indexEntity(entity) {
    var key = 'entity' + this.entityId;
    this.entityMap[key] = entity;
    this.entityId++;

    return key;
};

// Index an inline entity and returns the modified entity
ParsingSession.prototype.indexInlineEntity = function indexInlineEntity(entity) {
    entity.key = this.indexEntity(entity.entity);
    delete entity.entity;

    return entity;
};

// Convert an inline text into a list of inlineStyleRanges and entities
// it returns an object {ranges,text}
ParsingSession.prototype.toInlineStyleRanges = function toInlineStyleRanges(text) {
    var result = '';
    var inlineStyleRanges = [];
    var entityRanges = [];
    var offset = 0;
    var offsetDiff = 0;
    var rule, inlineMatch, inline;
    var rules = this.syntax.inlines.toArray();

    while(text) {
        for (var key = 0; key < rules.length; key++) {
            rule = rules[key];

            // Is it matching this rule?
            inlineMatch = rule.onText(this.ctx, text);
            if (!inlineMatch) continue;

            // Parse inside if rule allows it
            if (rule.option('parseInline') !== false) {
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
            result += text[0];
            text = text.substring(1);
        }
    }

    return {
        text: result,
        inlineStyleRanges: inlineStyleRanges,
        entityRanges: entityRanges
    };
};

// Post process raw content to apply "post" from rules
ParsingSession.prototype.postProcess = function postProcess() {
    var block, rule;

    for (var i = 0; i < this.blocks.length; i++) {
        block = this.blocks[i];
        rule = this.syntax.getBlockRule(block.type);

        if (!rule) throw new Error('Rule not found: ' + block.type);

        block.inlineStyleRanges = this.postProcessStyles(block.text, block.inlineStyleRanges);
        block.entityRanges = this.postProcessEntities(block.text, block.entityRanges);

        this.blocks[i] = rule.onFinish(this.ctx, block.text, block);
    }
};

// Post process inlineStyleRanges
ParsingSession.prototype.postProcessStyles = function postProcessStyles(text, inlineStyleRanges) {
    var range, rule;

    for (var i = 0; i < inlineStyleRanges.length; i++) {
        range = inlineStyleRanges[i];
        rule = this.syntax.getInlineRule(range.style);

        if (!rule) throw new Error('Rule not found: ' + range.style);

        rule.onFinish(
            this.ctx,
            text.slice(range.offset, range.offset + range.length),
            range
        );
    }

    return inlineStyleRanges;
};

// Post process entityRanges
ParsingSession.prototype.postProcessEntities = function postProcessEntities(text, entities) {
    var range, entity, rule;

    for (var i = 0; i < entities.length; i++) {
        range = entities[i];
        entity = this.entityMap[range.key];
        rule = this.syntax.getInlineRule(entity.type);

        if (!rule) throw new Error('Rule not found: ' + entity.type);

        this.entityMap[range.key] = rule.onFinish(
            this.ctx,
            text.slice(range.offset, range.offset + range.length),
            entity
        );
    }

    return entities;
};

module.exports = ParsingSession;
