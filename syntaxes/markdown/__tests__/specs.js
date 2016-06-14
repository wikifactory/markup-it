var fs = require('fs');
var path = require('path');

var MarkupIt = require('../../..');
var markdownSyntax = require('../');
var htmlSyntax = require('../../html');

var FIXTURES = path.resolve(__dirname, 'specs');

var markdown = new MarkupIt(markdownSyntax);
var html = new MarkupIt(htmlSyntax);

describe('Markdown Specs', function() {
    var files = fs.readdirSync(FIXTURES);

    files.forEach(function(file) {
        if (path.extname(file) !== '.md') return;

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

    var jsonContent2 = MarkupIt.JSONUtils.encode(content2);
    var jsonContent3 = MarkupIt.JSONUtils.encode(content3);

    jsonContent2.should.deepEqual(jsonContent3);
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

