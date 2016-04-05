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

    markup.Rule(markup.BLOCKS.FOOTNOTE)
        .toText(function(text, token) {
            var refname = token.data.id;

            return '<blockquote id="fn_' + refname + '">\n'
                + '<sup>' + refname + '</sup>. '
                + text
                + '<a href="#reffn_' + refname + '" title="Jump back to footnote [' + refname + '] in the text."> &#8617;</a>\n'
                + '</blockquote>\n';
        }),

    markup.Rule(markup.BLOCKS.HTML)
        .toText('%s\n\n'),

    markup.Rule(markup.BLOCKS.CODE)
        .toText(function(text, token) {
            return '<pre><code class="lang-' + token.data.syntax + '">' + text + '</code></pre>\n\n';
        })

];
