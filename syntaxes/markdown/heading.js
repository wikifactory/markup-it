var reHeading = require('./re/heading');
var markup = require('../../');

// Parse inner text of header to extract ID entity
function parseHeadingText(state, text) {
    var id, match;

    reHeading.id.lastIndex = 0;
    match = reHeading.id.exec(text);
    id = match? match[2] : null;

    if (id) {
        // Remove ID from text
        text = text.replace(match[0], '').trim();
    } else {
        text = text.trim();
    }

    return {
        tokens: state.parseAsInline(text),
        data: {
            id: id
        }
    };
}

// Generator for HEADING_X rules
function headingRule(level) {
    var prefix = Array(level + 1).join('#');

    return markup.Rule(markup.BLOCKS['HEADING_' + level])
        .regExp(reHeading.normal, function(state, match) {
            if (match[1].length != level) return null;
            return parseHeadingText(state, match[2]);
        })
        .regExp(reHeading.line, function(state, match) {
            var matchLevel = (match[2] === '=')? 1 : 2;
            if (matchLevel != level) return null;

            return parseHeadingText(state, match[1]);
        })
        .toText(function (state, token) {
            var data = token.getData();
            var innerContent = state.renderAsInline(token);

            if (data.id) {
                innerContent += ' {#' + data.id + '}';
            }

            return prefix + ' ' + innerContent + '\n\n';
        });
}


module.exports = headingRule;
