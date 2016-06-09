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

        function testToHTML(fixture) {
            fixture = resultHTML(fixture);
            // Our fixtures files all end with trailing newline
            (fixture.resultHTML).should.be.html(fixture.expectedHTML);
            return fixture;
        }

        function readFixture(filename) {
            var htmlFilePath = path.basename(filename, '.md') + '.html';

            var sourceMD = fs.readFileSync(path.resolve(FIXTURES, filename), 'utf8');
            var expectedHTML = fs.readFileSync(path.resolve(FIXTURES, htmlFilePath), 'utf8');

            return {
                content: markdown.toContent(sourceMD),
                sourceMD: sourceMD,
                expectedHTML: expectedHTML
            };
        }

        var files = fs.readdirSync(FIXTURES);
        files.forEach(function(file) {
            if (path.extname(file) !== '.md') return;
            if (ONLY && path.basename(file, '.md') !== ONLY) return;

            it(file, function() {
                var fixture = readFixture(file);
                fixture = testToHTML(fixture);
            });
        });
    });
});

function resultHTML(fixture) {
    if (!fixture.resultHTML) {
        fixture.resultHTML = html.toText(fixture.content);
    }
    return fixture;
}
