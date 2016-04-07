var Range = require('range-utils');
var ENTITIES = require('../constants/entities');

/*
    Normalize and decode a list of entity ranges

    @param {Array} entityRanges
    @param {Object} entityMap
    @return {Array}
*/
function decodeEntities(entityRanges, entityMap) {
    return entityRanges.reduce(function(result, range) {
        if (range.key) {
            range.entity = entityMap[range.key];
            delete range.key;
        }

        if (!range.entity || range.entity.type != ENTITIES.LINK_IMAGE) {
            result.push(range);
            return result;
        }

        result.push(Range(range.offset, range.length, {
            entity: {
                type: ENTITIES.IMAGE,
                data: {
                    src: range.entity.data.src,
                    title: range.entity.data.imageTitle
                }
            }
        }));
        result.push(Range(range.offset, range.length, {
            entity: {
                type: ENTITIES.LINK,
                data: {
                    href: range.entity.data.href,
                    title: range.entity.data.linkTitle
                }
            }
        }));

        return result;
    }, []);
}


module.exports = decodeEntities;
