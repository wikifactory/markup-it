var extend = require('extend');

// Return true if range a starts in b
function startsIn(a, b) {
    return (a.offset >= b.offset && a.offset < (b.offset + b.length));
}

// Return true if 2 ranges are collpasing
function areCollapsing(a, b) {
    return (startsIn(a, b) || startsIn(b, a));
}

// Move a range and return an new range
function move(range, offset, length) {
    return extend({}, range, {
        offset: offset,
        length: length
    });
}

// Collapse two ranges and return a list of ranges
function collapse(a, b) {
    var intersectionOffset = a.offset + (b.offset - a.offset);
    var intersectionLength = (a.offset + a.length - b.offset);

    return [
        move(a, a.offset, b.offset - a.offset),
        move(a, intersectionOffset,intersectionLength),
        move(b, intersectionOffset, intersectionLength),
        move(b, intersectionOffset + intersectionLength, b.offset + b. length - (intersectionOffset + intersectionLength))
    ];
}

// Ranges for draft are not always linear
// But markup languages require linear ranges
function linearize(ranges) {
    var result = [], range, last, collapsed;

    // Sort according to offset
    ranges.sort(function(a, b) {
        return a.offset - b.offset;
    });

    for (var i = 0; i < ranges.length; i++) {
        range = ranges[i];
        last = result[result.length - 1];

        if (last && areCollapsing(last, range)) {
            collapsed = collapse(last, range);

            // Remove last one
            result.pop();

            // Push new ranges
            result = result.concat(collapsed);

        } else {
            result.push(range);
        }
    }

    return result;
}

module.exports = {
    linearize: linearize,
    areCollapsing: areCollapsing
};
