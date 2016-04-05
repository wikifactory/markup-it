var markup = require('../../');

function headingRule(n) {
    var type = markup.BLOCKS['HEADING_' + n];

    return markup.Rule(type)
        .toText(function(text, token) {
            var attrs = '';
            if (token.data.id) attrs = ' id="' + token.data.id + '"';

            return '<h' + n + attrs + '>' + text + '</h' + n + '>\n\n';
        });
}

module.exports = [
    headingRule(1),
    headingRule(2),
    headingRule(3),
    headingRule(4),
    headingRule(5),
    headingRule(6),

    markup.Rule(markup.BLOCKS.HR)
        .toText('<hr />\n\n'),

    markup.Rule(markup.BLOCKS.HTML)
        .toText('%s\n\n'),

    markup.Rule(markup.BLOCKS.PARAGRAPH)
        .toText('<p>%s</p>\n\n'),

    markup.Rule(markup.BLOCKS.CODE)
        .toText(function(text, token) {
            return '<pre><code class="lang-' + token.data.syntax + '">' + text + '</code></pre>\n\n';
        })

];
