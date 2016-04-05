var markup = require('../../');

module.exports = markup.Syntax('markdown', {
    // List of rules for parsing blocks
    inline: require('./inlines'),

    // List of rules for parsing inline styles/entities
    blocks: require('./blocks')
});
