var rBlock = require('kramed/lib/rules/block');
var BLOCKS = require('../../').BLOCKS;

// Generator for HEADING_X rules
function headingRule(level) {
    var prefix = Array(level + 1).join('#');

    return {
        type: BLOCKS['HEADING_' + level],
        regexp: rBlock.heading,

        props: function(match) {
            if (match[1].length != level) return null;

            return {
                text: match[2]
            };
        },

        toText: function (text, block) {
            return prefix + ' ' + text + '\n\n';
        }
    }
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

            return {
                text: match[1]
            };
        }
    }
}


module.exports = {
    rule: headingRule,
    lrule: lheadingRule
}
