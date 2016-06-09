// Based on the origin 'list' reporter
/* eslint-disable no-console */

/**
 * Module dependencies.
 */

var Base = require('mocha').reporters.Base;
var inherits = require('util').inherits;
var color = Base.color;
var cursor = Base.cursor;

/**
 * Expose `Overview`.
 */

exports = module.exports = Overview;

/**
 * Initialize a new `Overview` test reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function Overview(runner) {
    Base.call(this, runner);

    var self = this;
    var indents = 0;
    var n = 0;

    function indent() {
        return Array(indents).join('  ');
    }

    runner.on('start', function() {
        console.log();
    });

    runner.on('suite', function(suite) {
        ++indents;
        console.log(color('suite', '%s%s'), indent(), suite.title);
    });

    runner.on('suite end', function() {
        --indents;
        if (indents === 1) {
            console.log();
        }
    });

    runner.on('pending', function(test) {
        var fmt = indent() + color('pending', '  - %s');
        console.log(fmt, test.title);
    });

    runner.on('pass', function(test) {
        var fmt;
        if (test.speed === 'fast') {
            fmt = indent()
                + color('checkmark', '  ' + Base.symbols.ok)
                + color('pass', ' %s');
            cursor.CR();
            console.log(fmt, test.title);
        } else {
            fmt = indent()
                + color('checkmark', '  ' + Base.symbols.ok)
                + color('pass', ' %s')
                + color(test.speed, ' (%dms)');
            cursor.CR();
            console.log(fmt, test.title, test.duration);
        }
    });

    runner.on('fail', function(test) {
        cursor.CR();
        console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
    });

    runner.on('end', self.epilogue.bind(self));
}

// Override listing of failures
Overview.prototype.epilogue = function() {
    var stats = this.stats;
    var fmt;

    console.log();

    // passes
    fmt = color('bright pass', ' ')
        + color('green', ' %d passing');

    console.log(fmt,
                stats.passes || 0);

    // pending
    if (stats.pending) {
        fmt = color('pending', ' ')
            + color('pending', ' %d pending');

        console.log(fmt, stats.pending);
    }

    // failures
    if (stats.failures) {
        fmt = color('fail', '  %d failing');

        console.log(fmt, stats.failures);

        // Silent this
        // Base.list(this.failures);
        console.log();
    }

    console.log();
};

/**
 * Inherit from `Base.prototype`.
 */
inherits(Overview, Base);

