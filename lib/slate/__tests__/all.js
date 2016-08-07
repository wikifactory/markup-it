var fs = require('fs');
var path = require('path');
var readMetadata = require('read-metadata');

var SlateUtils = require('../');
var JSONUtils = require('../../json');

describe.only('SlateUtils', function() {
    var tests = fs.readdirSync(__dirname);

    tests.forEach(function(test) {
        if (test[0] === '.' || path.extname(test).length > 0) return;

        it(test, function() {
            var dir      = path.resolve(__dirname, test);
            var input    = readMetadata.sync(path.resolve(dir, 'input.yaml'));
            var expected = readMetadata.sync(path.resolve(dir, 'expected.yaml'));

            input = JSONUtils.decode(input);

            var result = SlateUtils.encode(input);

            result.should.deepEqual(expected);
        });
    });
});
