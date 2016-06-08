// Based on the origin 'list' reporter

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

    var passes = 0;
    var failures = 0;

    var self = this;
    var n = 0;

    runner.on('start', function() {
        console.log();
    });

    runner.on('test', function(test) {
        process.stdout.write(color('pass', '    ' + test.fullTitle() + ': '));
    });

    runner.on('pending', function(test) {
        var fmt = color('checkmark', '  -')
                + color('pending', ' %s');
        console.log(fmt, test.fullTitle());
    });

    runner.on('pass', function(test) {
        passes++;
        var fmt = color('checkmark', '  ' + Base.symbols.dot)
                + color('pass', ' %s: ')
                + color(test.speed, '%dms');
        cursor.CR();
        console.log(fmt, test.fullTitle(), test.duration);
        failures++;
    });

    runner.on('fail', function(test) {
        cursor.CR();
        console.log(color('fail', '  %d) %s'), ++n, test.fullTitle());
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

