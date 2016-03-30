require('should');

var DraftMarkup = require('../');

/*
Simple syntax with only bold support
*/

var syntax = DraftMarkup.Syntax({
    inlines: [
        DraftMarkup.Rule(DraftMarkup.STYLES.BOLD)
            .regExp(/^\*([\s\S]+?)\*/, function(match) {
                return {
                    text: match[1]
                };
            })
            .toText('*%s*')
    ]
});


describe('Custom Syntax', function() {
    var markup = new DraftMarkup(syntax);

    describe('.toRawContent', function() {
        it('should parse as a paragraph', function() {
            var blocks = markup.toRawContent('Hello World').blocks;

            blocks.should.have.lengthOf(1);
            blocks[0].text.should.equal('Hello World');
            blocks[0].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
        });

        it('should parse inline', function() {
            var blocks = markup.toRawContent('Hello *World*').blocks;

            blocks.should.have.lengthOf(1);
            blocks[0].text.should.equal('Hello World');
            blocks[0].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
        });
    });

    describe('.toText', function() {
        it('should output correct string', function() {
            var text = markup.toText({
                blocks: [
                    {
                        text: 'Hello World',
                        inlineStyleRanges: [
                            {
                                offset: 6,
                                length: 5,
                                style: DraftMarkup.STYLES.BOLD
                            }
                        ]
                    }
                ]
            });

            text.should.equal('Hello *World*');
        });
    });
});
