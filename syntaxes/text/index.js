var MarkupIt = require('../../');

var defaultInlineRule = MarkupIt.Rule(MarkupIt.STYLES.TEXT)
    .setOption('parseInline', false)
    .toText('%s');

module.exports = MarkupIt.Syntax('markdown', {
    // List of rules for parsing blocks
    inline: [
        defaultInlineRule
    ],

    // List of rules for parsing inline styles/entities
    blocks: [
        MarkupIt.Rule(MarkupIt.BLOCKS.PARAGRAPH)
            .toText('%s\n\n')
    ]
});
