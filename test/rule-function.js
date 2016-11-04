const expect       = require('expect');
const RuleFunction = require('../src/models/rule-function');

describe('RuleFunction', () => {
    describe('.compose()', () => {
        it('should return a new RuleFunction', () => {
            const ruleFunction = new RuleFunction();
            const composed = ruleFunction
                .compose(() => {});

            expect(composed).toNotBe(ruleFunction);
            expect(composed).toBeA(RuleFunction);
        });
    });

    describe('.then()', () => {
        const ruleFunction = new RuleFunction();

        it('should return a new RuleFunction', () => {
            const composed = ruleFunction
                .then(() => {});

            expect(composed).toNotBe(ruleFunction);
            expect(composed).toBeA(RuleFunction);
        });

        it('should be chainable', () => {
            const composed = ruleFunction
                .then(() => {})
                .then(() => {})
                .then(() => {});

            expect(composed).toNotBe(ruleFunction);
            expect(composed).toBeA(RuleFunction);
        });

        it('should allow to modify a value', () => {
            const valueAdder = (state, value) => value + 1;

            const result = ruleFunction
                .then(valueAdder)
                .then(valueAdder)
                .then(valueAdder)
                .exec({}, 0);

            expect(result).toBe(3);
        });

        it('should execute the functions in the right order', () => {
            const result = ruleFunction
                .then((state, arr) => arr.map(value => value + 1))
                .then((state, arr) => arr.map(value => value * 2))
                .exec({}, [ 0, 1, 2 ]);

            expect(result).toEqual([ 2, 4, 6 ]);
        });

        it('should always pass the same state instance', () => {
            let passedState;
            let isSameState = false;

            const valueAdder = (state, value) => {
                // Set first passed state
                if (!passedState) {
                    passedState = state;
                }
                else {
                    // Compare first state and received state objects
                    isSameState = (passedState === state);
                }

                return value + 1;
            };

            const result = ruleFunction
                .then(valueAdder)
                .then(valueAdder)
                .then(valueAdder)
                .exec({}, 0);

            expect(result).toBe(3);
            expect(isSameState).toBe(true);
        });
    });

    describe('.filter()', () => {
        const ruleFunction = new RuleFunction();
        const initialState = { matchCriterion: true };
        const valueAdder   = (state, value) => value + 1;

        it('should not stop the execution when match is correct', () => {
            const result = ruleFunction
                .filter((state, value) => state.matchCriterion)
                .then(valueAdder)
                .exec(initialState, 0);

            expect(result).toBe(1);
        });

        it('should stop the execution when match is not correct', () => {
            const result = ruleFunction
                .filter((state, value) => !state.matchCriterion)
                .then(valueAdder)
                .exec(initialState, 0);

            expect(result).toBe(undefined);
        });
    });
});
