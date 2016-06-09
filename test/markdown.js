var fs = require('fs');
var argv = require('yargs').argv;
var path = require('path');
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

                it('HTML -> MD', function () {
                    testHtmlToMd(fixture);
                });

                it('MD -> HTML -> MD', function () {
                    testIdentityMd(fixture);
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

function testHtmlToMd(fixture) {
    var content = html.toContent(fixture.sourceHtml);
    var resultMd = markdown.toText(content);
    (resultMd).should.equal(fixture.sourceMd);
}

function testIdentityMd(fixture) {
    // MD to HTML
    var mdToContent = markdown.toContent(fixture.sourceMd);
    var resultHtml = html.toText(mdToContent);
    // HTML to MD
    var htmlToContent = html.toContent(resultHtml);
    var resultMd = markdown.toText(htmlToContent);
    (resultMd).should.equal(fixture.sourceMd);
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
