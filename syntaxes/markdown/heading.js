var reBlock = require('kramed/lib/rules/block');
var markup = require('../../');

var reId = /({#)(.+)(})/g;

// Parse inner text of header to extract ID entity
function parseHeadingText(text) {
    var id, match;

    reId.lastIndex = 0;
    match = reId.exec(text);
    id = match? match[2] : null;

    if (id) {
        // Remove ID from text
        text = text.replace(match[0], '').trim();
    } else {
        text = text.trim();
    }

    return {
        text: text,
        blockEntity: markup.Entity(markup.INLINES.HEADING_ID, markup.Entity.IMMUTABLE, {
            id: id
        })
    };
}

// Generator for HEADING_X rules
function headingRule(level) {
    var prefix = Array(level + 1).join('#');

    return markup.Rule(markup.BLOCKS['HEADING_' + level])
        .regExp(reBlock.heading, function(match) {
            if (match[1].length != level) return null;
            return parseHeadingText(match[2]);
        })
        .toText(function (text, entity) {
            if (entity && entity.data.id) {
                text += ' {#' + entity.data.id + '}';
            }

            return prefix + ' ' + text + '\n\n';
        });
}

// Generator for HEADING_X rules for line heading
// Since normal heading are listed first, onText is not required here
function lheadingRule(level) {
    return markup.Rule(markup.BLOCKS['HEADING_' + level])
        .regExp(reBlock.lheading, function(match) {
            var matchLevel = (match[2] === '=')? 1 : 2;
            if (matchLevel != level) return null;

            return parseHeadingText(match[1]);
        });
}

module.exports = {
    rule: headingRule,
    lrule: lheadingRule
};
