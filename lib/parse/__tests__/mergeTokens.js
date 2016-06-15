var Immutable = require('immutable');

var Token = require('../../models/token');
var STYLES = require('../../constants/styles');
var mergeTokens = require('../mergeTokens');

describe('mergeTokens', function() {
    it('should merge two tokens', function() {
        var tokens = Immutable.List([
            Token.createInlineText('Hello '),
            Token.createInlineText('world')
        ]);

        var merged = mergeTokens(tokens, [STYLES.TEXT]);
        merged.size.should.equal(1);

        var resultToken = merged.get(0);
        resultToken.getType().should.equal(STYLES.TEXT);
        resultToken.getText().should.equal('Hello world');
    });

    it('should merge three tokens', function() {
        var tokens = Immutable.List([
            Token.createInlineText('Hello '),
            Token.createInlineText('world'),
            Token.createInlineText('!')
        ]);

        var merged = mergeTokens(tokens, [STYLES.TEXT]);
        merged.size.should.equal(1);

        var resultToken = merged.get(0);
        resultToken.getType().should.equal(STYLES.TEXT);
        resultToken.getText().should.equal('Hello world!');
    });

    it('should merge 2x2 tokens', function() {
        var tokens = Immutable.List([
            Token.createInlineText('Hello '),
            Token.createInlineText('world'),
            new Token({
                type: STYLES.BOLD,
                text: ', right?'
            }),
            Token.createInlineText('!'),
            Token.createInlineText('!')
        ]);

        var merged = mergeTokens(tokens, [STYLES.TEXT]);
        merged.size.should.equal(3);

        var first = merged.get(0);
        var bold = merged.get(1);
        var second = merged.get(2);

        first.getType().should.equal(STYLES.TEXT);
        first.getText().should.equal('Hello world');

        bold.getType().should.equal(STYLES.BOLD);
        bold.getText().should.equal(', right?');

        second.getType().should.equal(STYLES.TEXT);
        second.getText().should.equal('!!');
    });
});
