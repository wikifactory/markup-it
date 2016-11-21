const block = require('./blocks');
const inline = require('./inlines');

const ALL = block.concat(inline);

// We always use all rule at once, since we deserialize using only one
// general rule, and the serialization has no ambiguity.
module.exports = { block: ALL };
