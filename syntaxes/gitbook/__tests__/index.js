var MarkupIt = require('../../../');
var gitbookSyntax = require('../');

describe('GitBook Markdown', function() {
    var markup = new MarkupIt(gitbookSyntax);

    describe('Math', function() {
        it('should parse a block', function() {
            var content = markup.toContent('$$\na = b\n$$');
            var blocks = content.getTokens();

            blocks.size.should.equal(1);
            blocks.get(0).getText().should.equal('a = b');
            blocks.get(0).getType().should.equal('math');
        });

        it('should parse inline math', function() {
            var content = markup.toContent('$$a = b$$');
            var blocks = content.getTokens();

            blocks.size.should.equal(1);
            blocks.get(0).getText().should.equal('a = b');
            blocks.get(0).getType().should.equal(MarkupIt.BLOCKS.PARAGRAPH);
        });

        it('should parse inline math with text', function() {
            var content = markup.toContent('Here are some math $$a = b$$, awesome!');
            var blocks = content.getTokens();

            blocks.size.should.equal(1);
            blocks.get(0).getText().should.equal('Here are some math a = b, awesome!');
            blocks.get(0).getType().should.equal(MarkupIt.BLOCKS.PARAGRAPH);
        });
    });
});
