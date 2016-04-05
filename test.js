var fs = require('fs');

var DraftMarkup = require('./lib');
var debug = require('./lib/utils/debug');
var markdown = require('./syntaxes/markdown');

var markup = new DraftMarkup(markdown);

var text = fs.readFileSync('README.md', 'utf8');

var content = markup.toContent(text); //'# Cool\n\nHello **World**');

debug.printContent(content);
