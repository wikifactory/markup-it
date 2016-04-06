var entities = require('html-entities');
var htmlEntities = new entities.AllHtmlEntities();

// Escape markdown syntax
// We escape only basic XML entities
function escape(str) {
    return htmlEntities.encode(str);
}

// Unescape markdown syntax
// We unescape all entities (HTML + XML)
function unescape(str) {
    return htmlEntities.decode(str);
}

module.exports = {
    escape: escape,
    unescape: unescape
};
