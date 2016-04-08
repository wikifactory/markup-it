var fs = require('fs');
var path = require('path');
var MarkupIt = require('../');
var markdownSyntax = require('../syntaxes/markdown');
var htmlSyntax = require('../syntaxes/html');

var FIXTURES = path.resolve(__dirname, 'fixtures/markdown');

var markdown = new MarkupIt(markdownSyntax);
var html = new MarkupIt(htmlSyntax);

function toHTML(text) {
    var content = markdown.toContent(text);
    return html.toText(content);
}

describe('Markdown', function() {

    describe('Fixtures', function() {
        function testFile(filename) {
            var htmlFilePath = path.basename(filename, '.md') + '.html';

            var sourceMD = fs.readFileSync(path.resolve(FIXTURES, filename), 'utf8');
            var expectedHTML = fs.readFileSync(path.resolve(FIXTURES, htmlFilePath), 'utf8');

            var resultHTML = toHTML(sourceMD);
            resultHTML.should.be.html(expectedHTML);
        }

        var files = fs.readdirSync(FIXTURES);
        files.forEach(function(file) {
            if (path.extname(file) != '.md') return;

            it(file, function() {
                testFile(file);
            });
        });
    });
});


