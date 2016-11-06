const splitLines = require('split-lines');
const { Serializer, Deserializer, Block, BLOCKS } = require('../');
const reBlock = require('./re/block');

/**
 * Serialize a code block to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.CODE)
    .then((state, node) => {
        const { text, data } = node;
        const syntax = data.get('syntax');
        const hasFences = text.indexOf('`') >= 0;

        // Use fences if syntax is set
        if (!hasFences || syntax) {
            return (
                '```' + syntax + '\n'
                + text + '\n'
                + '```\n\n'
            );
        }

        const lines = splitLines(text);
        return lines
            .map((line) => {
                if (!line.trim()) return '';
                return '    ' + line;
            })
            .join('\n') + '\n\n';
    });

/**
 * Deserialize a code block to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.paragraph)
    .then((state, match) => {
        const isInBlockquote = (state.get('blockquote') === state.getParentDepth());
        const isInLooseList = (state.get('looseList') === state.getParentDepth());
        const isTop = (state.getDepth() === 1);

        if (!isTop && !isInBlockquote && !isInLooseList) {
            return;
        }
        const text = match[1].trim();

        return Block.create({
            type: BLOCKS.PARAGRAPH,
            nodes: state.deserialize(text)
        });
    });

module.exports = { serialize, deserialize };
