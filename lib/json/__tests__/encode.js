var encode = require('../encode');
var BLOCKS = require('../../constants/blocks');

describe('encode', function() {
    var json;

    before(function() {
        json = encode(mock.paragraph);
    });

    it('should encode syntax name', function() {
        json.syntax.should.equal('mysyntax');
    });

    it('should encode tokens', function() {
        json.should.have.property('token');

        var doc = json.token;

        doc.tokens.should.have.lengthOf(1);

        var p = doc.tokens[0];
        p.type.should.equal(BLOCKS.PARAGRAPH);
        p.text.should.equal('Hello World');
        p.tokens.should.be.an.Array().with.lengthOf(2);
    });
});
