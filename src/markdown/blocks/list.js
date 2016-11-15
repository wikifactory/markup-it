const splitLines = require('split-lines');
const leftPad = require('left-pad');
const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const reList = require('../re/block').list;

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
    .matchRegExp(reList.block, (state, match) => {
        const rawList = match[0];
        const bull = match[2];
        const ordered = bull.length > 1;

        const type = ordered ? BLOCKS.OL_LIST : BLOCKS.UL_LIST;

        let item, loose, next = false;

        let lastIndex = 0;
        const nodes = [];
        let rawItem, textItem, space;
        const items = [];

        // Extract all items
        reList.item.lastIndex = 0;
        while ((item = reList.item.exec(rawList)) !== null) {
            rawItem = rawList.slice(lastIndex, reList.item.lastIndex);
            lastIndex = reList.item.lastIndex;

            items.push([item, rawItem]);
        }

        for (let i = 0; i < items.length; i++) {
            item = items[i][0];
            rawItem = items[i][1];

            // Remove the list item's bullet
            // so it is seen as the next token.
            textItem = item[0];
            space = textItem.length;
            textItem = textItem.replace(/^ *([*+-]|\d+\.) +/, '');

            // Outdent whatever the
            // list item contains. Hacky.
            if (~textItem.indexOf('\n ')) {
                space -= textItem.length;
                textItem =  textItem.replace(new RegExp('^ {1,' + space + '}', 'gm'), '');
            }

            // Determine whether item is loose or not.
            // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
            // for discount behavior.
            loose = next || /\n\n(?!\s*$)/.test(textItem);
            if (i !== items.length - 1) {
                next = textItem.charAt(textItem.length - 1) === '\n';
                if (!loose) loose = next;
            }

            const nodeItem = Block.create({
                type: BLOCKS.LIST_ITEM,
                nodes: (loose ? state.setProp('looseList', state.depth) : state)
                    .use('block')
                    .deserialize(textItem)
                // data: { loose }
            });


            nodes.push(nodeItem);
        }

        const listBlock = Block.create({
            type,
            nodes
        });

        return state.push(listBlock);
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
    const spaces = leftPad('', bullet.length, ' ');

    const rest = body.map(line => line ? `${spaces} ${line}` : '').join('\n');
    const eol = rest ? '' : '\n';

    const isLoose = list.nodes.some(child => child.type === BLOCKS.PARAGRAPH);

    return `${bullet} ${head}${rest ? '\n' + rest : ''}${eol}`;
}

module.exports = { serialize, deserialize };
