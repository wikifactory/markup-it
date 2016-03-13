require('should');
var fs = require('fs');
var path = require('path');
var kramed = require('kramed');

var DraftMarkup = require('../');
var markdown = require('../syntaxes/markdown');

var FIXTURES = path.resolve(__dirname, 'fixtures');

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

        describe('Escaping', function() {
            it('should return unescaped text', function() {
                var blocks = markup.toRawContent('Hello \\*World\\*').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello *World*');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
            });

            it('should render as unescaped text', function() {
                var state = markup.toRawContent('Hello \\*World\\*');
                var md = markup.toText(state);

                md.should.equal('Hello \\*World\\*\n\n');
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

            it('should parse header finishing with #', function() {
                var blocks = markup.toRawContent('## Hello ##').blocks;

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

            it('should parse multiple headers', function() {
                var blocks = markup.toRawContent('# Hello\n## Hello 2\n\n### Hello 3\n\n#### Hello 4').blocks;

                blocks.should.have.lengthOf(4);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.HEADING_1);
                blocks[1].text.should.equal('Hello 2');
                blocks[1].type.should.equal(DraftMarkup.BLOCKS.HEADING_2);
                blocks[2].text.should.equal('Hello 3');
                blocks[2].type.should.equal(DraftMarkup.BLOCKS.HEADING_3);
                blocks[3].text.should.equal('Hello 4');
                blocks[3].type.should.equal(DraftMarkup.BLOCKS.HEADING_4);
            });

            it('should parse lheading 1', function() {
                var blocks = markup.toRawContent('Hello\n======').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.HEADING_1);
            });

            it('should parse lheading 1', function() {
                var blocks = markup.toRawContent('Hello\n-------').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.HEADING_2);
            });

            it('should parse header id', function() {
                var blocks = markup.toRawContent('# Hello {#customID}').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello #');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.HEADING_1);
                blocks[0].entityRanges.should.have.lengthOf(1);
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

        describe('Unordered List', function() {
            it('should parse single item', function() {
                var blocks = markup.toRawContent('* Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.UL_ITEM);
            });

            it('should parse multiple item', function() {
                var blocks = markup.toRawContent('* Hello\n* World').blocks;

                blocks.should.have.lengthOf(2);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.UL_ITEM);
                blocks[1].text.should.equal('World');
                blocks[1].type.should.equal(DraftMarkup.BLOCKS.UL_ITEM);
            });

            it('should parse deep item', function() {
                var blocks = markup.toRawContent('* Hello\n  * World').blocks;

                blocks.should.have.lengthOf(2);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.UL_ITEM);
                blocks[1].text.should.equal('World');
                blocks[1].type.should.equal(DraftMarkup.BLOCKS.UL_ITEM);
                blocks[1].depth.should.equal(1);
            });

            it('should maintain newlines between following lists', function() {
                var blocks = markup.toRawContent('* Hello\n\n  * World').blocks;

                blocks.should.have.lengthOf(2);
                blocks[0].text.should.equal('Hello\n');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.UL_ITEM);
                blocks[1].text.should.equal('World');
                blocks[1].type.should.equal(DraftMarkup.BLOCKS.UL_ITEM);
                blocks[1].depth.should.equal(1);
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

            it('should parse fences code blocks', function() {
                var blocks = markup.toRawContent('```\nHello\nWorld\n```').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello\nWorld');
                blocks[0].type.should.equal(DraftMarkup.BLOCKS.CODE);
            });

            it('should parse fences code blocks with syntax', function() {
                var blocks = markup.toRawContent('```js\nHello\nWorld\n```').blocks;

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

            it('should parse code', function() {
                var blocks = markup.toRawContent('Hello `World`').blocks;

                blocks[0].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
                blocks[0].text.should.equal('Hello World');
                blocks[0].inlineStyleRanges.should.have.lengthOf(1);
                blocks[0].inlineStyleRanges[0].style.should.deepEqual(DraftMarkup.INLINES.CODE);
                blocks[0].inlineStyleRanges[0].offset.should.equal(6);
                blocks[0].inlineStyleRanges[0].length.should.equal(5);
            });
        });
    });

    describe('Inline Composition', function() {
        it('should parse bold + italic', function() {
            var blocks = markup.toRawContent('Hello **_World_**').blocks;

            blocks[0].type.should.equal(DraftMarkup.BLOCKS.PARAGRAPH);
            blocks[0].text.should.equal('Hello World');
            blocks[0].inlineStyleRanges.should.have.lengthOf(2);
            blocks[0].inlineStyleRanges[0].style.should.deepEqual(DraftMarkup.INLINES.ITALIC);
            blocks[0].inlineStyleRanges[0].offset.should.equal(6);
            blocks[0].inlineStyleRanges[0].length.should.equal(5);
            blocks[0].inlineStyleRanges[1].style.should.deepEqual(DraftMarkup.INLINES.BOLD);
            blocks[0].inlineStyleRanges[1].offset.should.equal(6);
            blocks[0].inlineStyleRanges[1].length.should.equal(5);
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

            md.should.equal('# Hello\n\nWorld\nTest\n\n');
        });

        it('should render code blocks', function() {
            var state = markup.toRawContent('    Hello\n    World');
            var md = markup.toText(state);

            md.should.equal('    Hello\n    World\n\n');
        });

        it('should render bold + link', function() {
            var state = markup.toRawContent('**[Hello](world.md)**');
            var md = markup.toText(state);

            md.should.equal('[**Hello**](world.md)\n\n');
        });

        it('should render bold + italic', function() {
            var state = markup.toRawContent('_**Hello World**_');
            var md = markup.toText(state);

            md.should.equal('_**Hello World**_\n\n');
        });

        describe('Lists', function() {
            it('should render UL', function() {
                var state = markup.toRawContent('* Hello\n* World');
                var md = markup.toText(state);

                md.should.equal('* Hello\n* World\n');
            });

            it('should render OL', function() {
                var state = markup.toRawContent('1. Hello\n2. World');
                var md = markup.toText(state);

                md.should.equal('1. Hello\n1. World\n');
            });

            it('should render depth items', function() {
                var state = markup.toRawContent('1. Hello\n  1. World\n  2. Monde\n2. Nice');
                var md = markup.toText(state);

                md.should.equal('1. Hello\n  1. World\n  1. Monde\n1. Nice\n');
            });

            it('should render UL + paragraphs', function() {
                var state = markup.toRawContent('1. Hello\n2. World\n\nHello World');
                var md = markup.toText(state);

                md.should.equal('1. Hello\n1. World\n\n\nHello World\n\n');
            });
        });
    });

    /*
        Test on a list of markdown files that:
            toMarkdown(fromMarkdown(X)) == toMarkdown(fromMarkdown(toMarkdown(fromMarkdown(X))))
     */
    describe('Fixtures', function() {
        function testFile(filename) {
            var content = fs.readFileSync(path.resolve(FIXTURES, filename), 'utf8');

            // g(f(x)) = g(x)
            var rawContent = markup.toRawContent(content);
            var markdownOutput = markup.toText(rawContent);

            kramed(markdownOutput).should.equal(kramed(content));

            // Test f(f(x)) = f(x)
            var rawContent2 = markup.toRawContent(markdownOutput);
            var markdownOutput2 = markup.toText(rawContent2);

            markdownOutput2.should.equal(markdownOutput);
        }

        var files = fs.readdirSync(FIXTURES);
        files.forEach(function(file) {
            it(file, function() {
                testFile(file);
            });
        });
    });
});


