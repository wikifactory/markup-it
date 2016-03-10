var should = require('should');

var Syntax = require('../').Syntax;
var markdown = require('../rules/markdown');

describe('Markdown', function() {
    var syntax = new Syntax(markdown);

    describe('Text to ContentState', function() {
        describe('Paragraphs', function() {
            it('should parse paragraph', function() {
                var blocks = syntax.toRawContent('Hello World').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello World');
                blocks[0].type.should.equal('paragraph');
            });

            it('should parse multiple paragraph', function() {
                var blocks = syntax.toRawContent('Hello World\n\nHello 2').blocks;

                blocks.should.have.lengthOf(2);
                blocks[0].type.should.equal('paragraph');
                blocks[0].text.should.equal('Hello World');

                blocks[1].type.should.equal('paragraph');
                blocks[1].text.should.equal('Hello 2');
            });
        });

        describe('Headings', function() {
            it('should parse header 1', function() {
                var blocks = syntax.toRawContent('# Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal('heading_1');
            });

            it('should parse header 2', function() {
                var blocks = syntax.toRawContent('## Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal('heading_2');
            });

            it('should parse header 3', function() {
                var blocks = syntax.toRawContent('### Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal('heading_3');
            });
        });

        describe('Code Blocks', function() {
            it('should parse single line code blocks', function() {
                var blocks = syntax.toRawContent('    Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal('code');
            });

            it('should parse multi lines code blocks', function() {
                var blocks = syntax.toRawContent('    Hello\n    World').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello\nWorld');
                blocks[0].type.should.equal('code');
            });
        });

        describe('Blocks', function() {
            it('should parse heading + paragraph', function() {
                var blocks = syntax.toRawContent('# Hello\n\nWorld').blocks;

                blocks.should.have.lengthOf(2);
                blocks[0].type.should.equal('heading_1');
                blocks[0].text.should.equal('Hello');

                blocks[1].type.should.equal('paragraph');
                blocks[1].text.should.equal('World');
            });
        });

        describe('Inline', function() {
            it('should parse bold', function() {
                var blocks = syntax.toRawContent('Hello **World**').blocks;

                blocks[0].type.should.equal('paragraph');
                blocks[0].text.should.equal('Hello World');
                blocks[0].characterList[0].should.deepEqual(['text']);
                blocks[0].characterList[6].should.deepEqual(['bold']);
            });

            it('should parse italic', function() {
                var blocks = syntax.toRawContent('Hello _World_').blocks;

                blocks[0].type.should.equal('paragraph');
                blocks[0].text.should.equal('Hello World');
                blocks[0].characterList[0].should.deepEqual(['text']);
                blocks[0].characterList[6].should.deepEqual(['italic']);
            });
        });
    });

    describe('ContentState to Text', function() {
        it('should render headings', function() {
            var state = syntax.toRawContent('# Hello');
            var md = syntax.toText(state);

            md.should.equal('# Hello\n\n');
        });

        it('should render headings + paragraphs', function() {
            var state = syntax.toRawContent('# Hello\n\nWorld\nTest');
            var md = syntax.toText(state);

            md.should.equal('# Hello\n\nWorld\n\nTest\n\n');
        });

        it('should render code blocks', function() {
            var state = syntax.toRawContent('    Hello\n    World');
            var md = syntax.toText(state);

            md.should.equal('    Hello\n    World\n\n');
        });
    });
});


