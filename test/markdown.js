var fs = require('fs');
var argv = require('yargs').argv;
var path = require('path');
var Immutable = require('immutable');
var MarkupIt = require('../');
var markdownSyntax = require('../syntaxes/markdown');
var htmlSyntax = require('../syntaxes/html');

var FIXTURES = path.resolve(__dirname, 'fixtures/markdown');

var markdown = new MarkupIt(markdownSyntax);
var html = new MarkupIt(htmlSyntax);

var ONLY = argv.testOnlyFixture;

describe('Markdown', function() {

    describe('Fixtures', function() {
        var files = fs.readdirSync(FIXTURES);
        files.forEach(function(file) {
            if (path.extname(file) !== '.md') return;
            if (ONLY && path.basename(file, '.md') !== ONLY) return;

            describe(file, function() {
                var fixture = readFixture(file);

                it('MD -> HTML', function () {
                    testMdToHtml(fixture);
                });

                it('Content -> MD -> Content === id', function () {
                    testMdIdempotence(fixture);
                });
            });
        });
    });
});


function testMdToHtml(fixture) {
    var content = markdown.toContent(fixture.sourceMd);
    var resultHtml = html.toText(content);
    (resultHtml).should.be.html(fixture.sourceHtml);
}

function testMdIdempotence(fixture) {
    var content1 = markdown.toContent(fixture.sourceMd);
    var backToMd = markdown.toText(content1);
    var content2 = markdown.toContent(backToMd);
    backToMd = markdown.toText(content2);
    var content3 = markdown.toContent(backToMd);

    Immutable.is(content2, content3).should.be.true();
}

function readFixture(filename) {
    var htmlFilePath = path.basename(filename, '.md') + '.html';

    var sourceMd = fs.readFileSync(path.resolve(FIXTURES, filename), 'utf8');
    var sourceHtml = fs.readFileSync(path.resolve(FIXTURES, htmlFilePath), 'utf8');

    return {
        sourceMd: sourceMd,
        sourceHtml: sourceHtml
    };
}
