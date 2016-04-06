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

        it('should correctly extract block tokens', function() {
            var tokens = content.getTokens();

            tokens.size.should.equal(2);
            tokens.get(0).getType().should.equal(MarkupIt.BLOCKS.HEADING_1);
            tokens.get(1).getType().should.equal(MarkupIt.BLOCKS.PARAGRAPH);
        });

        it('should correctly extract inline styles', function() {
            var tokens = content.getTokens();
            var p = tokens.get(1);
            var inline = p.getTokens();

            inline.size.should.equal(3);

            var bold = inline.get(0);
            bold.getType().should.equal(MarkupIt.STYLES.BOLD);
            bold.getText().should.equal('This');

            var text = inline.get(1);
            text.getType().should.equal(MarkupIt.STYLES.TEXT);
            text.getText().should.equal(' is a ');

            var link = inline.get(2);
            link.getType().should.equal(MarkupIt.ENTITIES.LINK);
            link.getText().should.equal('link');
        });

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
