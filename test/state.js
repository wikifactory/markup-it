const expect = require('expect');
const { Block } = require('slate');
const State  = require('../src/models/state');

describe('State', () => {

    describe('.push()', () => {
        it('should add nodes in the stack', () => {
            const state = (new State())
                .push(Block.create({ type: 'heading' }))
                .push(Block.create({ type: 'paragraph' }));

            const types = state.nodes.map(n => n.type).toArray();
            expect(types).toEqual(['heading', 'paragraph']);
        });
    });

    describe('.peek()', () => {
        it('should return the first node', () => {
            const state = (new State())
                .push(Block.create({ type: 'heading' }))
                .push(Block.create({ type: 'paragraph' }));

            const node = state.peek();
            expect(node.type).toBe('heading');
        });
    });

});
