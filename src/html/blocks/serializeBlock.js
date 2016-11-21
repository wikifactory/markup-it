const is = require('is');
const { Map } = require('immutable');

/**
 * @param {String} tag The HTML tag
 * @return {Function} A function to seralize a node into
 */
function serializeBlock(tag, opts = {}) {
    Object.assign(opts, {
        isSingleTag: false,
        getAttrs: (node) => {}
    });

    return function(state) {
        const node = state.peek();
        const attrs = opts.getAttrs(node);

        let attrsText = attrsToString(attrs);
        if (attrsText !== '') attrsText = ' ' + attrsText;

        let text;
        if (opts.isSingleTag) {
            text = `<${tag}${attrsText}/>`;
        } else {
            const inner = state.serialize(node.nodes);
            text = `<${tag}${attrsText}>${inner}</${tag}>`;
        }

        return state
            .shift()
            .write(text);
    };
}

/**
 * Convert a map of attributes into a string of HTML attributes.
 * @param {Object} attrs
 * @return {String}
 */
function attrsToString(attrs) {
    attrs = new Map(attrs);

    return attrs.reduce((output, value, key) => {
        if (is.undef(value) || is.nil(value)) {
            return output;
        } else if (is.equal(value, '')) {
            return output + ` ${key}`;
        } else {
            return output + ` ${key}=${JSON.stringify(value)}`;
        }
    }, '');
}

module.exports = serializeBlock;
