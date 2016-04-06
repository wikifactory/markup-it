#! /usr/bin/env node
/* eslint-disable no-console */

var DraftMarkup = require('../');
var markdownSyntax = require('../syntaxes/markdown');

var utils = require('./utils');

utils.command(function(content, markup) {
    var htmlMarkup = new DraftMarkup(markdownSyntax);
    var output = htmlMarkup.toText(content);

    console.log(output);
});
