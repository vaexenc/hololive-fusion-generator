const talents = require("./talents.json");
const util = require("./util");

function getTalentById(id) {
    const talent = talents[id];
    if (!talent)
        throw new Error("talent not found");
    return talent;
}

function getTalentCountAll() {
    return util.getObjectLength(talents);
}

function getTalentIdsEnabled() {
    return Object.entries(talents).filter(e => e[1].enabled).map(e => e[0]);
}

function getTalentCountEnabled() {
    return getTalentIdsEnabled().length;
}

function calculateTalentVariationsEnabled() {
    return util.calculateVariations(getTalentCountEnabled());
}

function calculateTalentVariationsAll() {
    return util.calculateVariations(getTalentCountAll());
}

function getTalentIdsAll() {
    return Object.keys(talents);
}

function getTalentId(talentObj) {
    for (const currentTalent of Object.entries(talents)) {
        if (talentObj === currentTalent[1])
            return currentTalent[0];
    }
}

function getTalentCategory(talentObj) {
    return talentObj["category"];
}

function getTalentIdsFromCategory(talentCategory) {
    let availableIds = []
    for (let [key, value] of Object.entries(talents)) {
        if (value.category.includes(talentCategory)) {
            availableIds.push(key);
        }
    }
    return availableIds;
}

function getTalentIdsEnabledFromCategory(talentCategory) {
    let availableIds = []
    for (let [key, value] of Object.entries(talents)) {
        if (value.category.includes(talentCategory) && value.enabled) {
            availableIds.push(key);
        }
    }
    return availableIds;
}

module.exports = {
    calculateTalentVariationsAll,
    calculateTalentVariationsEnabled,
    getTalentById,
    getTalentCountAll,
    getTalentCountEnabled,
    getTalentId,
    getTalentIdsAll,
    getTalentIdsEnabled,
    getTalentCategory,
    getTalentIdsFromCategory,
    getTalentIdsEnabledFromCategory
};