const { Record} = require('immutable');

const DEFAULTS = {
    text: String()
};

class Text extends Record(DEFAULTS) {

    /**
     * Create a new text node from a set of properties.
     * @param  {String | Text} text
     * @return {Text} text
     */
    create(text = '') {
        if (text instanceof Text) return text;
        return new Text({ text });
    }

    /**
     * Get the node's kind.
     *
     * @return {String} kind
     */

    get kind() {
      return 'text'
    }

    /**
     * Is the node empty?
     *
     * @return {Boolean} isEmpty
     */

    get isEmpty() {
      return this.text == ''
    }

}

module.exports = Text;
