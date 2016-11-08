const expect       = require('expect');
const Deserializer = require('../src/models/deserializer');
const State        = require('../src/models/state');

describe('Deserializer', () => {
    const state = new State();

    describe('.matchRegExp()', () => {
        it('should return undefined when the regexp does not match', () => {
            const result = Deserializer()
                .matchRegExp(
                    /abc/,
                    () => true
                )
                .exec(state.write('xyz'));

            expect(result).toBe(undefined);
        });

        it('should return the value of the callback when the regexp matches', () => {
            const result = Deserializer()
                .matchRegExp(
                    /.*(abc).*/,
                    (newState, match) => match[1]
                )
                .exec(state.write('abcdefgh'));

            expect(result).toBe('abc');
        });
    });
});
