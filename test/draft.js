var MarkupIt = require('../');
var mock = require('./mock');

describe('DraftUtils', function() {

    describe('decode', function() {


    });

    describe('encode', function() {

        describe('paragraph + heading', function() {
            var rawContent = MarkupIt.DraftUtils.encode(mock.titleParagraph);

            it('should return empty entityMap', function() {
                rawContent.should.have.property('entityMap');
                rawContent.entityMap.should.deepEqual({});
            });

            it('should return blocks', function() {
                rawContent.should.have.property('blocks');
                rawContent.blocks.should.have.lengthOf(2);

                rawContent.blocks[0].should.have.property('type');
                rawContent.blocks[0].should.have.property('text');
                rawContent.blocks[0].type.should.equal(MarkupIt.BLOCKS.HEADING_1);

                rawContent.blocks[1].type.should.equal(MarkupIt.BLOCKS.PARAGRAPH);
            });
        });

    });


});
