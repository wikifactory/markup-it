var fs = require('fs');
var path = require('path');

var encode = require('../encode');
var JSONUtils = require('../../json');

var FIXTURES = path.resolve(__dirname, 'specs');

var files = fs.readdirSync(FIXTURES);

describe.only('encode', function() {
    files.forEach(function(file) {
        if (path.extname(file) !== '.js') return;

        it(file, function () {
            var content = require(path.join(FIXTURES, file));
            var contentState = JSONUtils.decode(content.json);

            encode(contentState).should.deepEqual(content.prosemirror);
        });
    });
});

describe('decode', function() {
    files.forEach(function(file) {
        if (path.extname(file) !== '.md') return;

        it(file, function () {

        });
    });
});
