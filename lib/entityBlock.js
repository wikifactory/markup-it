var Range = require('./range');
var Entity = require('./entity');

// Utility to create block which contain one big entity
function EntityBlock(type, text, mutability, data) {
    return {
        text: text,
        entityRanges: [
            Range(0, text.length, {
                entity: Entity(type, mutability, data)
            })
        ]
    };
}

module.exports = EntityBlock;
