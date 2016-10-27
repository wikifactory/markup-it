const BLOCKS = require('../constants/blocks');
const Serializer = require('../models/serializer');
const Deserializer = require('../models/deserializer');
const Node = require('../models/node');

const reHeading = require('./re/heading');

const TYPES = [
    BLOCKS.HEADING_1,
    BLOCKS.HEADING_2,
    BLOCKS.HEADING_3,
    BLOCKS.HEADING_4,
    BLOCKS.HEADING_5,
    BLOCKS.HEADING_6
];

/**
 * Serialize an heading node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(TYPES)
    .then((state, node) => {
        const { type, data } = node;
        const { id } = data;
        const depth = TYPES.indexOf(type)
        const prefix = Array(depth + 2).join('#')
        let inner = state.serialize(node.nodes);
        if (id) inner = `${inner} {#${id}}`;

        return `${prefix} ${inner}\n\n`;
    });

/**
 * Deserialize a normal heading (starting with "#..") and headings using
 * line syntax to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reHeading.normal, (state, match) => {
        const level = match[1].length;
        return parseHeadingText(state, level, match[2]);
    })
    .matchRegExp(reHeading.line, (state, match) => {
        const level = (match[2] === '=')? 1 : 2;
        return parseHeadingText(state, level, match[1]);
    });


/**
 * Parse inner text of header to extract ID entity
 * @param  {State} state
 * @param  {Number} level
 * @param  {String} text
 * @return {Node}
 */
function parseHeadingText(state, level, text) {
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

    return Node.create({
        type:
        nodes: state.deserialize(text),
        data: {
            id: id
        }
    });
}

module.exports = { serialize, deserialize };
