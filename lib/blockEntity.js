var Entity = require('./entity');

// Utility to create block with metadata
function BlockEntity(type, text, mutability, data) {
    return {
        text: text,
        blockEntity: Entity(type, mutability, data)
    };
}

module.exports = BlockEntity;
