var Immutable = require('immutable');

var RawContentState = Immutable.Record({
    entityMap: new Immutable.Map(),
    blocks: new Immutable.List()
});

// Return the map of entities
RawContentState.prototype.getEntityMap = function() {
    return this.get('entityMap');
};

// Return the list of blocks
RawContentState.prototype.getBlocks = function() {
    return this.get('blocks');
};

// Return an entity using its key
RawContentState.prototype.getEntity = function(key) {
    var entityMap = this.getEntityMap();
    return entityMap.get(key);
};

module.exports = RawContentState;
