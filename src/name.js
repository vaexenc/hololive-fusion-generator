const talent = require("./talent");

function changeFirstCharToUppercase(string) {
	return string[0].toUpperCase() + string.slice(1);
}

function isLastCharOfStr1SameAsFirstCharOfStr2(string1, string2) {
	return string1.slice(-1).toLowerCase() === string2[0].toLowerCase();
}

function removeLastCharOfString(string) {
	return string.slice(0, -1);
}

function getFullNameOfTalent(talent) {
	return {
		lastName: changeFirstCharToUppercase(talent.lastName),
		firstName: changeFirstCharToUppercase(talent.firstName)
	};
}

function fuseNames(name1, name2) {
	let firstChunk = changeFirstCharToUppercase(name1);
	if (isLastCharOfStr1SameAsFirstCharOfStr2(firstChunk, name2))
		firstChunk = removeLastCharOfString(firstChunk);
	return firstChunk + name2;
}

function fuseNamesOfSameTypeOfTalents(
	talent1,
	talent2,
	nameType // either "lastName" or "firstName"
) {
	const nameBefore = talent1[nameType + "Before"];
	const nameAfter = talent2[nameType + "After"];
	return fuseNames(nameBefore, nameAfter);
}

function fuseLastNamesOfTalents(talent1, talent2) {
	return fuseNamesOfSameTypeOfTalents(talent1, talent2, "lastName");
}

function fuseFirstNamesOfTalents(talent1, talent2) {
	return fuseNamesOfSameTypeOfTalents(talent1, talent2, "firstName");
}

function fuseFullNameOfTalents(talent1, talent2) {
	if (talent1 === talent2)
		return getFullNameOfTalent(talent1);

	let lastName, firstName;

	if (talent1.lastName && talent2.lastName)
		lastName = fuseLastNamesOfTalents(talent1, talent2);

	if (talent1.firstName && talent2.firstName)
		firstName = fuseFirstNamesOfTalents(talent1, talent2);

	return {
		lastName: lastName,
		firstName: firstName
	};
}

function fuseFullNameOfTalentsByID(id1, id2) {
	return fuseFullNameOfTalents(
		talent.getTalentByID(id1),
		talent.getTalentByID(id2)
	);
}

module.exports = {
	fuseNames,
	fuseLastNamesOfTalents,
	fuseFirstNamesOfTalents,
	fuseFullNameOfTalents,
	fuseFullNameOfTalentsByID
};
