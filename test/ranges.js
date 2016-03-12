require('should');
var ranges = require('../lib/ranges');

describe('Ranges', function() {
    describe('.areCollapsing', function() {
        it('should return false if not collapsing', function() {
            ranges.areCollapsing(
                {
                    offset: 0,
                    length: 10
                },
                {
                    offset: 10,
                    length: 10
                }
            ).should.equal(false);
        });

        it('should return true if not collapsing', function() {
            ranges.areCollapsing(
                {
                    offset: 0,
                    length: 13
                },
                {
                    offset: 10,
                    length: 10
                }
            ).should.equal(true);
        });
    });

    describe('.linearize', function() {
        it('should not modified linearized ranges', function() {
            var out = ranges.linearize([
                {
                    offset: 0,
                    length: 10,
                    type: 'BOLD'
                },
                {
                    offset: 10,
                    length: 10,
                    type: 'ITALIC'
                }
            ]);

            out.should.have.lengthOf(2);
        });

        it('should linearize ranges', function() {
            ranges.linearize([
                {
                    offset: 0,
                    length: 13,
                    type: 'BOLD'
                },
                {
                    offset: 10,
                    length: 10,
                    type: 'ITALIC'
                }
            ]).should.deepEqual([
                {
                    offset: 0,
                    length: 10,
                    type: 'BOLD'
                },
                {
                    offset: 10,
                    length: 3,
                    type: 'BOLD'
                },
                {
                    offset: 10,
                    length: 3,
                    type: 'ITALIC'
                },
                {
                    offset: 13,
                    length: 7,
                    type: 'ITALIC'
                }
            ]);
        });
    });

});
