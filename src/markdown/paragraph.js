const { Serializer, Deserializer, Block, BLOCKS } = require('../');
const reBlock = require('./re/block');

/**
 * Serialize a paragraph to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.PARAGRAPH)
    .then((state, node) => {
        const inner = state.serialize(node.nodes);
        return `${inner}\n\n`;
    });

/**
 * Deserialize a paragraph to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.paragraph, (state, match) => {
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
