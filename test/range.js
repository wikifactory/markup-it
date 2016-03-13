require('should');
var Range = require('../lib/range');

describe('Range', function() {
    describe('.contains', function() {
        it('should return false if does not contain offset', function() {
            Range.contains({
                offset: 0,
                length: 10
            }, 11).should.equal(false);

            Range.contains({
                offset: 0,
                length: 10
            }, 10).should.equal(false);

            Range.contains({
                offset: 0,
                length: 10
            }, 15).should.equal(false);

            Range.contains({
                offset: 10,
                length: 10
            }, 4).should.equal(false);

            Range.contains({
                offset: 10,
                length: 10
            }, 40).should.equal(false);
        });

        it('should return true if contain offset', function() {
            Range.contains({
                offset: 0,
                length: 10
            }, 1).should.equal(true);

            Range.contains({
                offset: 0,
                length: 10
            }, 0).should.equal(true);
        });
    });

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
                    offset: 0,
                    length: 10,
                    type: 'ITALIC'
                }
            ];
            Range.linearize(ranges).should.deepEqual(ranges);
        });
    });

    describe('.fill', function() {
        it('should fill empty spaces (mid)', function() {
            var ranges = [
                {
                    offset: 0,
                    length: 2,
                    type: 'BOLD'
                },
                {
                    offset: 3,
                    length: 2,
                    type: 'ITALIC'
                }
            ];

            Range.fill('ab cd', ranges, {
                type: 'unstyled'
            }).should.deepEqual([
                { offset: 0, length: 2, type: 'BOLD' },
                { type: 'unstyled', offset: 2, length: 1 },
                { offset: 3, length: 2, type: 'ITALIC' }
            ]);
        });

        it('should fill empty spaces (begining)', function() {
            var ranges = [
                {
                    offset: 2,
                    length: 2,
                    type: 'BOLD'
                },
                {
                    offset: 4,
                    length: 2,
                    type: 'ITALIC'
                }
            ];

            Range.fill('ab cd', ranges, {
                type: 'unstyled'
            }).should.deepEqual([
                { type: 'unstyled', offset: 0, length: 2 },
                { offset: 2, length: 2, type: 'BOLD' },
                { offset: 4, length: 2, type: 'ITALIC' }
            ]);
        });
    });

});
