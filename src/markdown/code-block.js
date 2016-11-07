const splitLines = require('split-lines');
const { Serializer, Deserializer, Block, BLOCKS } = require('../');
const reBlock = require('./re/block');

/**
 * Serialize a code block to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.CODE)
    .then((state) => {
        const node = state.peek();
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
        const output = lines
            .map((line) => {
                if (!line.trim()) return '';
                return '    ' + line;
            })
            .join('\n') + '\n\n';

        return state
            .unshift()
            .write(output);
    });

/**
 * Deserialize a code block to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.fences, (state, match) => {
        // const isInBlockquote = (state.get('blockquote') === state.getParentDepth());
        // const isInLooseList = (state.get('looseList') === state.getParentDepth());
        // const isTop = (state.getDepth() === 1);
        //
        // if (!isTop && !isInBlockquote && !isInLooseList) {
        //     return;
        // }

        // Extract code block text
        const text = match[3].trim();

        // Extract language syntax
        let data;
        if (Boolean(match[2])) {
            data = {
                syntax: match[2].trim()
            };
        }

        const node = Block.create({
            type: BLOCKS.CODE,
            nodes: state.deserialize(text),
            data
        });

        return state.push(node);
    });

module.exports = { serialize, deserialize };
