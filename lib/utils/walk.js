var Range = require('range-utils');

/*
    Walk throught the children tokens tree, and execute function
    for each token with a text range relative to the base token

    @param {Token} base
    @param {Function(token, range)}
    @return {String}
*/
function walk(base, fn) {
    var offset = 0;
    var tokens = base.getTokens();

    if (tokens.size === 0) {
        return base.getText();
    }

    return tokens.reduce(function(output, token) {
        var innerText = walk(token, function(tok, range) {
            var realRange = Range.moveBy(range, offset);
            fn(tok, realRange);
        });

        fn(
            token,
            Range(offset, innerText.length)
        );

        offset += innerText.length;
        return (output + innerText);
    }, '');
}


module.exports = walk;
