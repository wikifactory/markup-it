require('should');

var DraftMarkup = require('../');
var gitbook = require('../syntaxes/gitbook');

describe.only('GitBook Markdown', function() {
    var markup = new DraftMarkup(gitbook);

    describe('Math', function() {
        it('should parse a block', function() {
            var blocks = markup.toRawContent('$$\na = b\n$$').blocks;

            blocks.should.have.lengthOf(1);
            blocks[0].text.should.equal('a = b');
            blocks[0].type.should.equal('math-block');
        });

        it('should parse inline math', function() {
            var blocks = markup.toRawContent('$$a = b$$').blocks;

            blocks.should.have.lengthOf(1);
            blocks[0].text.should.equal('a = b');
            blocks[0].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
        });

        it('should parse inline math with text', function() {
            var blocks = markup.toRawContent('Here are some math $$a = b$$, awesome!').blocks;

            blocks.should.have.lengthOf(1);
            blocks[0].text.should.equal('Here are some math a = b, awesome!');
            blocks[0].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
        });
    });
});
