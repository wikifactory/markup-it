const expect     = require('expect');
const Serializer = require('../src/models/serializer');

describe('Serializer', () => {
    const blockNode = {
        type: 'paragraph',
        kind: 'block'
    };

    describe('.matchType()', () => {
        it('should continue execution when passed a correct string', () => {
            const result = Serializer()
                .matchType('paragraph')
                .then(() => true)
                .exec({}, blockNode);

            expect(result).toBe(true);
        });

        it('should continue execution when passed a correct array', () => {
            const result = Serializer()
                .matchType([ 'code_block', 'paragraph' ])
                .then(() => true)
                .exec({}, blockNode);

            expect(result).toBe(true);
        });

        it('should continue execution when passed a correct function', () => {
            const result = Serializer()
                .matchType(type => type == 'paragraph')
                .then(() => true)
                .exec({}, blockNode);

            expect(result).toBe(true);
        });

        it('should return undefined when passed an incorrect value', () => {
            const result = Serializer()
                .matchType(() => {})
                .then(() => true)
                .exec({}, blockNode);

            expect(result).toBe(undefined);
        });
    });

    describe('.matchKind()', () => {
        it('should continue execution when passed a correct string', () => {
            const result = Serializer()
                .matchKind('block')
                .then(() => true)
                .exec({}, blockNode);

            expect(result).toBe(true);
        });

        it('should continue execution when passed a correct array', () => {
            const result = Serializer()
                .matchKind([ 'text', 'block' ])
                .then(() => true)
                .exec({}, blockNode);

            expect(result).toBe(true);
        });

        it('should continue execution when passed a correct function', () => {
            const result = Serializer()
                .matchKind(kind => kind == 'block')
                .then(() => true)
                .exec({}, blockNode);

            expect(result).toBe(true);
        });

        it('should return undefined when passed an incorrect value', () => {
            const result = Serializer()
                .matchKind(() => {})
                .then(() => true)
                .exec({}, blockNode);

            expect(result).toBe(undefined);
        });
    });
});
