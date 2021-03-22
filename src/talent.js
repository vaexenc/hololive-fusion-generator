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
	return util.calculateVariations(getTalentCountEnabled(), 2);
}

function calculateTalentVariationsAll() {
	return util.calculateVariations(getTalentCountAll(), 2);
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

module.exports = {
	getTalentById,
	getTalentCountAll,
	getTalentIdsEnabled,
	getTalentCountEnabled,
	calculateTalentVariationsEnabled,
	calculateTalentVariationsAll,
	getTalentIdsAll,
	getTalentId
};
