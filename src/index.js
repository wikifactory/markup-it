const { Block, Inline, Text, Mark, Range } = require('slate');

const State = require('./models/state');
const Deserializer = require('./models/deserializer');
const Serializer = require('./models/serializer');

const MARKS = require('./constants/marks');
const BLOCKS = require('./constants/blocks');
const INLINES = require('./constants/inlines');

module.exports = {
    State,
    Serializer,
    Deserializer,
    // Constants
    MARKS,
    BLOCKS,
    INLINES,
    // Slate exports
    Block, Inline, Text, Mark, Range
};
