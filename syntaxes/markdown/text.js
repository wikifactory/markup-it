var reInline = require('kramed/lib/rules/inline');
var utils = require('./utils');

// Update RegExp for text/escape to stop at strikethrough
var reText = utils.replace(reInline.gfm.text)(']|', '~]|')();
var reEscape = utils.replace(reInline.escape)('])', '~|])')();

module.exports = {
    re: reText,
    reEscape: reEscape
};

