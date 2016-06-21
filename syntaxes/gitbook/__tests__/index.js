var MarkupIt = require('../../../');
var gitbookSyntax = require('../');

describe('GitBook Markdown', function() {
    var markup = new MarkupIt(gitbookSyntax);

    describe('Math', function() {
        it('should parse a block', function() {
            var content = markup.toContent('$$\na = b\n$$');
            var math = content.getToken().getTokens().get(0);

            math.getText().should.equal('a = b');
            math.getType().should.equal('math');
        });

        it('should parse inline math', function() {
            var content = markup.toContent('$$a = b$$');
            var p = content.getToken().getTokens().get(0);

            p.getPlainText().should.equal('a = b');
            p.getType().should.equal(MarkupIt.BLOCKS.PARAGRAPH);
        });

        it('should parse inline math with text', function() {
            var content = markup.toContent('Here are some math $$a = b$$, awesome!');
            var p = content.getToken().getTokens().get(0);

            p.getPlainText().should.equal('Here are some math a = b, awesome!');
            p.getType().should.equal(MarkupIt.BLOCKS.PARAGRAPH);
        });
    });
});
