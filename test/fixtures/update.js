var fs = require('fs');
var replaceExt = require('replace-ext');
var readdirp = require('readdirp');
var path = require('path');
var es = require('event-stream');
var GitHub = require('octocat');


var client = new GitHub({
    token: '633d972f16dfd99eaf924aa5ebc6e3bfe1a6e8a0'
});

var stream = readdirp({
    root: path.join(__dirname, 'markdown'),
    fileFilter: '*.md'
});


stream
    .pipe(es.map(function (entry, callback) {
        var content = fs.readFileSync(entry.fullPath, 'utf8');
        client.post('/markdown', {
            text: content
        })
        .then(function(data) {
            fs.writeFileSync(
                replaceExt(entry.fullPath, '.html'),
                data.body, 'utf8'
            );

            callback(null, entry.path);
        }, callback);
    }))
    .on('error', function(err) {
        console.log('error:', err);
        process.exit(1);
    })
    .pipe(es.stringify())
    .pipe(process.stdout);
