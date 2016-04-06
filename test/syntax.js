var MarkupIt = require('../');

/*
    Simple syntax with only bold support
*/
var syntax = MarkupIt.Syntax('mysyntax', {
    inline: [
        MarkupIt.Rule(MarkupIt.STYLES.BOLD)
            .regExp(/^\*([\s\S]+?)\*/, function(match) {
                return {
                    text: match[1]
                };
            })
            .toText('*%s*')
    ]
});


describe.only('Custom Syntax', function() {
    var markup = new MarkupIt(syntax);

    describe('.toContent', function() {
        it('should return correct syntax name', function() {
            var content = markup.toContent('Hello');
            content.getSyntax().should.equal('mysyntax');
        });

        it('should parse as a unstyled', function() {
            var content = markup.toContent('Hello World');
            var tokens = content.getTokens();

            tokens.size.should.equal(1);
            var p = tokens.get(0);

            p.getType().should.equal(MarkupIt.BLOCKS.UNSTYLED);
            p.getText().should.equal('Hello World');
        });

        it('should parse inline', function() {
            var content = markup.toContent('Hello *World*');
            var tokens = content.getTokens();

            tokens.size.should.equal(1);
            var p = tokens.get(0);

            p.getType().should.equal(MarkupIt.BLOCKS.UNSTYLED);
            p.getText().should.equal('Hello World');
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
                                style: MarkupIt.STYLES.BOLD
                            }
                        ]
                    }
                ]
            });

            text.should.equal('Hello *World*');
        });
    });
});
