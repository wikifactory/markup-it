var decode = require('../decode');
var ENTITIES = require('../../constants/entities');
var BLOCKS = require('../../constants/blocks');
var STYLES = require('../../constants/styles');

describe('decode', function() {
    var content;

    before(function() {
        var rawContent = {
            entityMap: {
                '1': {
                    type: ENTITIES.LINK,
                    mutability: 'MUTABLE',
                    data: {
                        href: 'http://google.fr'
                    }
                }
            },
            blocks: [
                {
                    type: BLOCKS.HEADING_1,
                    text: 'Hello World',
                    inlineStyleRanges: [],
                    entityRanges: []
                },
                {
                    type: BLOCKS.PARAGRAPH,
                    text: 'This is a link',
                    inlineStyleRanges: [
                        {
                            offset: 0,
                            length: 4,
                            style: STYLES.BOLD
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

        content = decode(rawContent);
    });

    it('should correctly extract block tokens', function() {
        var tokens = content.getTokens();

        tokens.size.should.equal(2);
        tokens.get(0).getType().should.equal(BLOCKS.HEADING_1);
        tokens.get(1).getType().should.equal(BLOCKS.PARAGRAPH);
    });

    it('should correctly extract inline styles', function() {
        var tokens = content.getTokens();
        var p = tokens.get(1);
        var inline = p.getTokens();

        inline.size.should.equal(3);

        var bold = inline.get(0);
        bold.getType().should.equal(STYLES.BOLD);
        bold.getText().should.equal('This');

        var text = inline.get(1);
        text.getType().should.equal(STYLES.TEXT);
        text.getText().should.equal(' is a ');

        var link = inline.get(2);
        link.getType().should.equal(ENTITIES.LINK);
        link.getText().should.equal('link');
    });
});
