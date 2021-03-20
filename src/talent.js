const talentList = require("./talent-list.json");
const util = require("./util");

function getTalentByID(id) {
	const talent = talentList[id];
	if (!talent)
		throw new Error("talent not found");
	return talent;
}

function getAmountOfTalents() {
	return util.getLengthOfObject(talentList);
}

function getIDsOfEnabledTalents() {
	return Object.entries(talentList).filter(e => e[1].enabled).map(e => e[0]);
}

function getAmountOfEnabledTalents() {
	return getIDsOfEnabledTalents().length;
}

function getAmountOfEnabledTalentVariations() {
	return util.getAmountOfVariations(getAmountOfEnabledTalents(), 2);
}

function getAmountOfTotalTalentVariations() {
	return util.getAmountOfVariations(getAmountOfTalents(), 2);
}

function getAllTalentIDs() {
	return Object.keys(talentList);
}

module.exports = {
	getTalentByID,
	getAmountOfTalents,
	getIDsOfEnabledTalents,
	getAmountOfEnabledTalents,
	getAmountOfEnabledTalentVariations,
	getAmountOfTotalTalentVariations,
	getAllTalentIDs
};
