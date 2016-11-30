const { Serializer, Mark, MARKS } = require('../../');
const utils = require('../utils');

// Mark to signal that this range has been escaped
const MARK = '__escaped__';

/**
 * Escape all text ranges during serialization.
 * This step should be done before processing text ranges for marks.
 *
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchKind('text')

    // We can't escape empty text node
    .filter(state => {
        const text = state.peek();
        return !text.isEmpty;
    })

    // Avoid infinite loop
    .filterNot(Serializer().matchMark(MARK))

    // Escape all text
    .transformRanges((state, range) => {
        const { text, marks } = range;
        const hasCode = marks.some(mark => mark.type === MARKS.CODE);

        return range.merge({
            text: hasCode ? text : utils.escape(text, false),
            marks: marks.add(Mark.create({ type: MARK }))
        });
    });

module.exports = { serialize };
