#! /usr/bin/env node
/* eslint-disable no-console */

var utils = require('./utils');

utils.command(function(content) {
    console.log(JSON.stringify(content.toJS(), null, 4));
});
