const talentList = require("./talent-list.json");

function getTalentByID(id) {
	return talentList[id];
}

module.exports = {
	getTalentByID
};
