var encode = require('../encode');
var BLOCKS = require('../../constants/blocks');

describe('encode', function() {
    var json;

    before(function() {
        json = encode(mock.paragraph);
        console.log(JSON.stringify(json, null, 4))
    });

    it('should encode as doc node', function() {
        json.type.should.equal('doc');
    });

    it('should encode tokens', function() {
        json.content.should.have.lengthOf(1);

        var p = json.tokens[0];
        p.type.should.equal(BLOCKS.PARAGRAPH);
        p.text.should.equal('Hello World');
        p.tokens.should.be.an.Array().with.lengthOf(2);
    });
});
