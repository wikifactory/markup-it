var rBlock = require('kramed/lib/rules/block');
var BLOCKS = require('../../').BLOCKS;
var INLINES = require('../../').INLINES;

var reId = /({#)(.+)(})/g;

// Parse inner text of header to extract ID entity
function parseHeadingText(text) {
    var id, offset, match;

    reId.lastIndex = 0;
    match = reId.exec(text);
    id = match? match[2] : null;

    if (id) {
        // Remove ID from text
        text = text.replace(match[0], '').trim();

        // Add ID indicator
        text = text + ' #';
        offset = text.length - 1;
    } else {
        text = text.trim();
    }

    return {
        text: text,
        entityRanges: id? [
            {
                offset: offset,
                length: 1,
                entity: {
                    mutability: 'IMMUTABLE',
                    type: INLINES.HEADING_ID,
                    data: {
                        id: id
                    }
                }
            }
        ] : null
    };
}


// Generator for HEADING_X rules
function headingRule(level) {
    var prefix = Array(level + 1).join('#');

    return {
        type: BLOCKS['HEADING_' + level],
        regexp: rBlock.heading,

        props: function(match) {
            if (match[1].length != level) return null;

            return parseHeadingText(match[2]);
        },

        toText: function (text, block) {
            return prefix + ' ' + text + '\n\n';
        }
    };
}

// Generator for HEADING_X rules for line heading
// Since normal heading are listed first, onText is not required here
function lheadingRule(level) {
    return {
        type: BLOCKS['HEADING_' + level],
        regexp: rBlock.lheading,

        props: function(match) {
            var matchLevel = (match[2] === '=')? 1 : 2;
            if (matchLevel != level) return null;

            return parseHeadingText(match[1]);
        }
    };
}


module.exports = {
    rule: headingRule,
    lrule: lheadingRule
};
