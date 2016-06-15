var encode = require('../encode');
var BLOCKS = require('../../constants/blocks');

describe('decode', function() {
    var json;

    before(function() {
        json = encode(mock.paragraph);
    });

    it('should encode syntax name', function() {
        json.syntax.should.equal('mysyntax');
    });

    it('should encode tokens', function() {
        json.tokens.should.have.lengthOf(1);

        var p = json.tokens[0];
        p.type.should.equal(BLOCKS.PARAGRAPH);
        p.text.should.equal('Hello World');
        p.tokens.should.be.an.Array().with.lengthOf(2);
    });
});
