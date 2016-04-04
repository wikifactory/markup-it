var identity = require('./utils/identity');

/*
    Annotator lets you apply change to content
*/


function Annotator(def) {
    this.onBlock = def.onBlock || identity;
    this.onStyle = def.onStyle || identity;
    this.onEntity = def.onEntity || identity;
}

// Annotate a contentState
Annotator.prototype.annotate = function(rawContentState) {

};


module.exports = Annotator;
