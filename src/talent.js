const talentList = require("./talent-list.json");

function getTalentByID(id) {
	const talent = talentList[id];
	if (!talent)
		throw new Error("talent not found");
	return talent;
}

module.exports = {
	getTalentByID
};
