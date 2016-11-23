const splitLines = require('split-lines');
const { Serializer, Deserializer, Block, Text, BLOCKS } = require('../../');
const reBlock = require('../re/block');

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
        let output;

        // Use fences if syntax is set
        if (!hasFences || syntax) {
            output = `${'```'}${Boolean(syntax) ? syntax : ''}\n` +
                     `${text}\n` +
                     `${'```'}\n\n`;

            return state
                .shift()
                .write(output);
        }

        const lines = splitLines(text);
        output = lines
            .map((line) => {
                if (!line.trim()) return '';
                return '    ' + line;
            })
            .join('\n') + '\n\n';

        return state
            .shift()
            .write(output);
    });

/**
 * Deserialize a code block to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.fences, (state, match) => {
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
            nodes: [
                Text.createFromString(text)
            ],
            data
        });

        return state.push(node);
    });

module.exports = { serialize, deserialize };
