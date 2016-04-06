var MarkupIt = require('../');
var mock = require('./mock');

describe('DraftUtils', function() {

    describe('decode', function() {
        var rawContent = {
            entityMap: {
                '1': {
                    type: MarkupIt.ENTITIES.LINK,
                    mutability: 'MUTABLE',
                    data: {
                        href: 'http://google.fr'
                    }
                }
            },
            blocks: [
                {
                    type: MarkupIt.BLOCKS.HEADING_1,
                    text: 'Hello World',
                    inlineStyleRanges: [],
                    entityRanges: []
                },
                {
                    type: MarkupIt.BLOCKS.PARAGRAPH,
                    text: 'This is a link',
                    inlineStyleRanges: [
                        {
                            offset: 0,
                            length: 4,
                            style: MarkupIt.STYLES.BOLD
                        }
                    ],
                    entityRanges: [
                        {
                            offset: 10,
                            length: 4,
                            key: '1'
                        }
                    ]
                }
            ]
        };

        var content = MarkupIt.DraftUtils.decode(rawContent);
        console.log(content);
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
