const blocks = require('./blocks');
const inlines = require('./inlines');

const ALL = blocks.concat(inlines);

// We always try to match with all rules, since we deserialize using
// only one general rule, and the serialization has no ambiguity.
module.exports = { block: ALL };
