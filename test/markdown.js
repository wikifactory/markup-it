var should = require('should');

var DraftMarkup = require('../');
var markdown = require('../rules/markdown');

describe('Markdown', function() {
    var markup = new DraftMarkup(markdown);

    describe('Text to ContentState', function() {
        describe('Paragraphs', function() {
            it('should parse paragraph', function() {
                var blocks = markup.toRawContent('Hello World').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello World');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
            });

            it('should parse multiple paragraph', function() {
                var blocks = markup.toRawContent('Hello World\n\nHello 2').blocks;

                blocks.should.have.lengthOf(2);
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
                blocks[0].text.should.equal('Hello World');

                blocks[1].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
                blocks[1].text.should.equal('Hello 2');
            });
        });

        describe('Headings', function() {
            it('should parse header 1', function() {
                var blocks = markup.toRawContent('# Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.HEADING_1);
            });

            it('should parse header 2', function() {
                var blocks = markup.toRawContent('## Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.HEADING_2);
            });

            it('should parse header 3', function() {
                var blocks = markup.toRawContent('### Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.HEADING_3);
            });
        });

        describe('Blockquotes', function() {
            it('should parse single line blockquote', function() {
                var blocks = markup.toRawContent('> Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.BLOCKQUOTE);
            });
        });

        describe.only('Unordered List', function() {
            it('should parse single item', function() {
                var blocks = markup.toRawContent('* Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.UL_ITEM);
            });

            it('should parse multiple item', function() {
                var blocks = markup.toRawContent('* Hello\n* World').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.UL_ITEM);
            });
        });

        describe('Code Blocks', function() {
            it('should parse single line code blocks', function() {
                var blocks = markup.toRawContent('    Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.CODE);
            });

            it('should parse multi lines code blocks', function() {
                var blocks = markup.toRawContent('    Hello\n    World').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello\nWorld');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.CODE);
            });
        });

        describe('Blocks', function() {
            it('should parse heading + paragraph', function() {
                var blocks = markup.toRawContent('# Hello\n\nWorld').blocks;

                blocks.should.have.lengthOf(2);
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.HEADING_1);
                blocks[0].text.should.equal('Hello');

                blocks[1].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
                blocks[1].text.should.equal('World');
            });
        });

        describe('Inline Styles', function() {
            it('should parse bold', function() {
                var blocks = markup.toRawContent('Hello **World**').blocks;

                blocks[0].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
                blocks[0].text.should.equal('Hello World');
                blocks[0].inlineStyleRanges.should.have.lengthOf(1);
                blocks[0].inlineStyleRanges[0].style.should.deepEqual(DraftMarkup.INLINES.BOLD);
                blocks[0].inlineStyleRanges[0].offset.should.equal(6);
                blocks[0].inlineStyleRanges[0].length.should.equal(5);
            });

            it('should parse italic', function() {
                var blocks = markup.toRawContent('Hello _World_').blocks;

                blocks[0].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
                blocks[0].text.should.equal('Hello World');
                blocks[0].inlineStyleRanges.should.have.lengthOf(1);
                blocks[0].inlineStyleRanges[0].style.should.deepEqual(DraftMarkup.INLINES.ITALIC);
                blocks[0].inlineStyleRanges[0].offset.should.equal(6);
                blocks[0].inlineStyleRanges[0].length.should.equal(5);
            });

            it('should parse strikethrought', function() {
                var blocks = markup.toRawContent('Hello ~~World~~').blocks;

                blocks[0].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
                blocks[0].text.should.equal('Hello World');
                blocks[0].inlineStyleRanges.should.have.lengthOf(1);
                blocks[0].inlineStyleRanges[0].style.should.deepEqual(DraftMarkup.INLINES.STRIKETHROUGH);
                blocks[0].inlineStyleRanges[0].offset.should.equal(6);
                blocks[0].inlineStyleRanges[0].length.should.equal(5);
            });
        });
    });

    describe('Links', function() {
        it('should parse link', function() {
            var content = markup.toRawContent('[Hello World](page.md)');

            content.blocks[0].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
            content.blocks[0].text.should.equal('Hello World');
            content.blocks[0].entityRanges.should.have.lengthOf(1);

            var key = content.blocks[0].entityRanges[0].key;
            var entity = content.entityMap[key];

            entity.type.should.equal(DraftMarkup.INLINES.LINK);
            entity.data.href.should.equal('page.md');
        });
    });

    describe('Images', function() {
        it('should parse link', function() {
            var content = markup.toRawContent('![Hello World](test.png)');

            content.blocks[0].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
            content.blocks[0].text.should.equal('Hello World');
            content.blocks[0].entityRanges.should.have.lengthOf(1);

            var key = content.blocks[0].entityRanges[0].key;
            var entity = content.entityMap[key];

            entity.type.should.equal(DraftMarkup.INLINES.IMAGE);
            entity.data.src.should.equal('test.png');
        });
    });

    describe('ContentState to Text', function() {
        it('should render headings', function() {
            var state = markup.toRawContent('# Hello');
            var md = markup.toText(state);

            md.should.equal('# Hello\n\n');
        });

        it('should render headings + paragraphs', function() {
            var state = markup.toRawContent('# Hello\n\nWorld\nTest');
            var md = markup.toText(state);

            md.should.equal('# Hello\n\nWorld\n\nTest\n\n');
        });

        it('should render code blocks', function() {
            var state = markup.toRawContent('    Hello\n    World');
            var md = markup.toText(state);

            md.should.equal('    Hello\n    World\n\n');
        });
    });
});


