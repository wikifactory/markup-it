const splitLines = require('split-lines');
const leftPad = require('left-pad');
const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const reBlock = require('../re/block');

/**
 * Serialize a list to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType([ BLOCKS.UL_LIST, BLOCKS.OL_LIST ])
    .then((state) => {
        const list = state.peek();
        const { nodes } = list;

        const output = nodes
            .map((item, index) => renderItemToText(state, list, item, index))
            .join('')
            + '\n';

        return state.shift().write(output);
    });

/**
 * Deserialize a list to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.paragraph, (state, match) => {

    });

/**
 * Render a list item to markdown
 * @param  {State} state
 * @param  {Block} list
 * @param  {Block} item
 * @param  {Number} index
 * @return {String} output
 */
function renderItemToText(state, list, item, index) {
    let bullet = '*';

    if (list.type === BLOCKS.OL_LIST) {
        bullet = `${(index + 1)}.`;
    }

    const inner = state.use('block').serialize(item.nodes);
    const lines = splitLines(inner);
    const head = lines[0];
    const body = lines.slice(1);
    const spaces = leftPad('X', bullet.length, ' ');

    const rest = body.map(line => line ? `${spaces} ${line}` : '').join('\n');
    const eol = rest ? '' : '\n';

    const isLoose = list.nodes.some(child => child.type === BLOCKS.PARAGRAPH);

    return `${bullet} ${head}${rest ? '\n' + rest : ''}${eol}`;
}

module.exports = { serialize, deserialize };
