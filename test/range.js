require('should');
var Range = require('../lib/range');

describe('Range', function() {
    describe('.areCollapsing', function() {
        it('should return false if not collapsing', function() {
            Range.areCollapsing({
                offset: 0,
                length: 10
            }, {
                offset: 10,
                length: 10
            }).should.equal(false);
        });

        it('should return true if collapsing', function() {
            Range.areCollapsing({
                offset: 0,
                length: 13
            }, {
                offset: 10,
                length: 10
            }).should.equal(true);
        });
    });

    describe('.linearize', function() {
        it('should not modified linearized ranges', function() {
            var out = Range.linearize([
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
            Range.linearize([
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

        it('should not linearized // ranges', function() {
            var ranges = [
                {
                    offset: 0,
                    length: 10,
                    type: 'BOLD'
                },
                {
                    offset: 00,
                    length: 10,
                    type: 'ITALIC'
                }
            ];
            Range.linearize(ranges).should.deepEqual(ranges);
        });
    });

});
