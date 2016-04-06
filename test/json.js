var MarkupIt = require('../');

describe('JSON', function() {

    describe('decode', function() {
        var content = MarkupIt.JSONUtils.decode({
            syntax: 'mysyntax',
            tokens: [
                {
                    type: MarkupIt.BLOCKS.PARAGRAPH,
                    text: 'Hello World',
                    raw: 'Hello World'
                }
            ]
        });

        it('should decode syntax name', function() {
            content.getSyntax().should.equal('mysyntax');
        });

        it('should decode tokens tree', function() {
            var tokens = content.getTokens();
            tokens.size.should.equal(1);

            var p = tokens.get(0);
            p.getType().should.equal(MarkupIt.BLOCKS.PARAGRAPH);
            p.getText().should.equal('Hello World');
            p.getRaw().should.equal('Hello World');
            p.getTokens().size.should.equal(0);
        });

    });


});
