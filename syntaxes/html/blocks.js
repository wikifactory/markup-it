var markup = require('../../');
var HTMLRule = require('./rule');

function headingRule(n) {
    var type = markup.BLOCKS['HEADING_' + n];
    return HTMLRule(type, 'h'+n);
}

module.exports = [
    headingRule(1),
    headingRule(2),
    headingRule(3),
    headingRule(4),
    headingRule(5),
    headingRule(6),

    HTMLRule(markup.BLOCKS.HR, 'hr'),
    HTMLRule(markup.BLOCKS.PARAGRAPH, 'p'),
    HTMLRule(markup.BLOCKS.BLOCKQUOTE, 'blockquote'),
    HTMLRule(markup.BLOCKS.FOOTNOTE, 'div', function(data) {
        return {
            'id': 'footnote-' + data.id,
            'class': 'footnote'
        };
    }),


    markup.Rule(markup.BLOCKS.HTML)
        .toText('%s\n\n'),

    markup.Rule(markup.BLOCKS.CODE)
        .toText(function(text, token) {
            return '<pre><code class="lang-' + token.data.syntax + '">' + text + '</code></pre>\n\n';
        })

];
