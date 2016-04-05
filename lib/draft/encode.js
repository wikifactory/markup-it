/*
    Transform a Content instance into a RawContentState for draft
*/
function encodeToDraft(content) {
    var entityMap = {};
    var blocks = [];


    return {
        blocks: blocks,
        entityMap: entityMap
    };
}



module.exports = encodeToDraft;
