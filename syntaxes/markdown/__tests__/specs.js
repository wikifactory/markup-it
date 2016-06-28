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

    describe('MD -> HTML', function() {
        files.forEach(function(file) {
            if (path.extname(file) !== '.md') return;

            it(file, function () {
                var fixture = readFixture(file);
                testMdToHtml(fixture);
            });
        });
    });

    describe('MD -> MD', function() {
        files.forEach(function(file) {
            if (path.extname(file) !== '.md') return;

            it(file, function () {
                var fixture = readFixture(file);
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

    var resultHtml2 = html.toText(content2);
    var resultHtml3 = html.toText(content3);

    (resultHtml2).should.be.html(resultHtml3);
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

