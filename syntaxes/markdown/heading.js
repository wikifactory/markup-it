var reHeading = require('./re/heading');
var markup = require('../../');

// Parse inner text of header to extract ID entity
function parseHeadingText(text) {
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
        text: text,
        data: {
            id: id
        }
    };
}

// Generator for HEADING_X rules
function headingRule(level) {
    var prefix = Array(level + 1).join('#');

    return markup.Rule(markup.BLOCKS['HEADING_' + level])
        .regExp(reHeading.normal, function(match) {
            if (match[1].length != level) return null;
            return parseHeadingText(match[2]);
        })
        .toText(function (text, block) {
            if (block.data.id) {
                text += ' {#' + block.data.id + '}';
            }

            return prefix + ' ' + text + '\n\n';
        });
}

// Generator for HEADING_X rules for line heading
// Since normal heading are listed first, onText is not required here
function lheadingRule(level) {
    return markup.Rule(markup.BLOCKS['HEADING_' + level])
        .regExp(reHeading.line, function(match) {
            var matchLevel = (match[2] === '=')? 1 : 2;
            if (matchLevel != level) return null;

            return parseHeadingText(match[1]);
        });
}

module.exports = {
    rule: headingRule,
    lrule: lheadingRule
};
