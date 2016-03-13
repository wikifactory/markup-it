var extend = require('extend');
var find = require('lodash.find');

function Range(offset, length, props) {
    var range = {};

    extend(range, props);
    range.offset = offset || 0;
    range.length = length || 0;

    return range;
}

// Return end position
Range.end = function end(range) {
    return (range.offset + range.length);
};

// Return true if an offset is in the range
Range.contains = function contains(range, offset) {
    return (offset >= range.offset && offset < (range.offset + range.length));
};

// Return true if range starts in b
Range.startsIn = function startsIn(a, b) {
    return (a.offset >= b.offset && a.offset < (b.offset + b.length));
};

// Return true if range is before a
Range.isBefore = function isBefore(a, b) {
    return (a.offset < b.offset);
};

// Return true if range is after a
Range.isAfter = function isAfter(a, b) {
    return (a.offset >= Range.end(b));
};

// Return true if both ranges have the same position
Range.areEquals = function areEquals(a, b) {
    return (a.offset === b.offset && a.length === b.length);
};

// Return true if range is collapsing with another range
Range.areCollapsing = function areCollapsing(a, b) {
    return ((Range.startsIn(a, b) || Range.startsIn(b, a)) && !Range.areEquals(a, b));
};

// Move this range to a new position, returns a new range
Range.move = function move(range, offset, length) {
    return Range(offset, length, range);
};

// Move a range from a specified index
Range.moveBy = function moveBy(range, index) {
    return Range(range.offset + index, range.length, range);
};

// Enlarge a range
Range.enlarge = function enlarge(range, index) {
    return Range(range.offset, range.length + index, range);
};

// Considering a list of applied ranges with special prop "value" (text after application)
// (offset,length are still relative to the current string)
// It moves a range to match the resulting text
Range.relativeTo = function relativeTo(start, ranges) {
    return ranges.reduce(function(current, range) {
        var change = range.value.length - range.length;

        // Change if before the other modification, range is not affected
        if (Range.isBefore(current, range)) {
            return current;
        }

        // Change is after the last modification, move it by the difference in length
        if (Range.isAfter(current, range)) {
            return Range.moveBy(current, change);
        }

        if (current.offset == range.offset) {
            return Range.enlarge(current, change);
        }

        return current;
    }, start);
};

// Collapse two ranges and return a list of ranges
Range.collapse = function collapse(a, b) {
    var intersectionOffset = a.offset + (b.offset - a.offset);
    var intersectionLength = (a.offset + a.length - b.offset);

    return [
        Range.move(a, a.offset, b.offset - a.offset),
        Range.move(a, intersectionOffset, intersectionLength),
        Range.move(b, intersectionOffset, intersectionLength),
        Range.move(b, intersectionOffset + intersectionLength, b.offset + b. length - (intersectionOffset + intersectionLength))
    ];
};

// Ranges for draft are not always linear
// But markup languages require linear ranges
Range.linearize = function linearize(ranges) {
    var result = [], range, last, collapsed;

    // Sort according to offset
    ranges = Range.sort(ranges);

    for (var i = 0; i < ranges.length; i++) {
        range = ranges[i];
        last = result[result.length - 1];

        if (last && Range.areCollapsing(last, range)) {
            collapsed = Range.collapse(last, range);

            // Remove last one
            result.pop();

            // Push new ranges
            result = result.concat(collapsed);

        } else {
            result.push(range);
        }
    }

    return result;
};

// Sort a list of ranges (using offset position)
Range.sort = function(ranges) {
    return [].concat(ranges).sort(function(a, b) {
        return a.offset - b.offset;
    });
};

// Fill empty spaces in a text with new ranges
// Ranges should be linearized
Range.fill = function(text, ranges, props) {
    var rangeStart = 0;
    var rangeLength = 0;
    var result = [];
    var range;

    function pushFilledRange() {
        if (!rangeLength) return;

        result.push(Range(rangeStart, rangeLength, props));
    }

    for (var i = 0; i < text.length; i++) {
        range = Range.findByOffset(ranges, i);

        if (range) {
            pushFilledRange();

            rangeStart = i + 1;
            rangeLength = 0;
        } else {
            rangeLength++;
        }
    }

    pushFilledRange();

    return Range.sort(result.concat(ranges));
};

// Find a range containing an offset
Range.findByOffset = function findByOffset(ranges, offset) {
    return find(ranges, function(range) {
        return Range.contains(range, offset);
    });
};

// Move a list of ranges
Range.moveRangesBy = function moveRanges(ranges, index) {
    return ranges.map(function(range) {
        return Range.moveBy(range, index);
    });
};

module.exports = Range;
