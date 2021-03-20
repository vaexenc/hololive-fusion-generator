const talentList = require("./talent-list.json");
const util = require("./util");

function getTalentById(id) {
	const talent = talentList[id];
	if (!talent)
		throw new Error("talent not found");
	return talent;
}

function getAmountOfTalents() {
	return util.getLengthOfObject(talentList);
}

function getIdsOfEnabledTalents() {
	return Object.entries(talentList).filter(e => e[1].enabled).map(e => e[0]);
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
	return Object.keys(talentList);
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
