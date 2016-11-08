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

    describe('.write()', () => {
        it('should add text to the buffer', () => {
            const state = (new State())
                .write('Hello')
                .write(' World');

            expect(state.text).toBe('Hello World');
        });
    });

    describe('.skip()', () => {
        it('should skip N characters from text', () => {
            const state = (new State())
                .write('Hello World')
                .skip(5);

            expect(state.text).toBe(' World');
        });
    });
});
