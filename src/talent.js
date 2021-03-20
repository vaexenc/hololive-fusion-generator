const talents = require("./talents.json");
const util = require("./util");

function getTalentById(id) {
	const talent = talents[id];
	if (!talent)
		throw new Error("talent not found");
	return talent;
}

function getAmountOfTalents() {
	return util.getLengthOfObject(talents);
}

function getIdsOfEnabledTalents() {
	return Object.entries(talents).filter(e => e[1].enabled).map(e => e[0]);
}

function getAmountOfEnabledTalents() {
	return getIdsOfEnabledTalents().length;
}

function getAmountOfEnabledTalentVariations() {
	return util.getAmountOfVariations(getAmountOfEnabledTalents(), 2);
}

function getAmountOfTotalTalentVariations() {
	return util.getAmountOfVariations(getAmountOfTalents(), 2);
}

function getAllTalentIds() {
	return Object.keys(talents);
}

module.exports = {
	getTalentById,
	getAmountOfTalents,
	getIdsOfEnabledTalents,
	getAmountOfEnabledTalents,
	getAmountOfEnabledTalentVariations,
	getAmountOfTotalTalentVariations,
	getAllTalentIds
};
