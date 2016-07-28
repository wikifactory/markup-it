var Content = require('../models/content');

/**
 * Decode a JSON into a Content
 *
 * @param {Object} json
 * @return {Content}
 */
function decodeContentFromSlate(json) {
    return Content.createFromToken(
        'slate',
        decodeTokenFromJSON(json)
    );
}

module.exports = decodeContentFromSlate;
