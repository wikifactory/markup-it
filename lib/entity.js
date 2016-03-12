
// Utility to create entity
function Entity(type, mutability, data) {
    return {
        mutability: mutability || Entity.MUTABLE,
        type: type,
        data: data
    };
}

Entity.MUTABLE = 'MUTABLE';
Entity.IMMUTABLE = 'IMMUTABLE';
Entity.SEGMENTED = 'SEGMENTED';

module.exports = Entity;
