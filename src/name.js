const talent = require("./talent");

const nameType = {
	LAST_NAME: "lastName",
	FIRST_NAME: "firstName"
};

function changeFirstCharToUppercase(string) {
	return string[0].toUpperCase() + string.slice(1);
}

function isLastCharOfStr1SameAsFirstCharOfStr2(string1, string2) {
	return string1.slice(-1).toLowerCase() === string2[0].toLowerCase();
}

function removeLastCharOfString(string) {
	return string.slice(0, -1);
}

function getTalentFullName(talent) {
	return {
		lastName: changeFirstCharToUppercase(talent.lastName),
		firstName: changeFirstCharToUppercase(talent.firstName)
	};
}

function fuseNameChunks(chunk1, chunk2) {
	let firstChunk = changeFirstCharToUppercase(chunk1);
	if (isLastCharOfStr1SameAsFirstCharOfStr2(firstChunk, chunk2))
		firstChunk = removeLastCharOfString(firstChunk);
	return firstChunk + chunk2;
}

function fuseTalentNamesOfSameType(talent1, talent2, nameType) {
	const nameBefore = talent1[nameType + "Before"];
	const nameAfter = talent2[nameType + "After"];
	return fuseNameChunks(nameBefore, nameAfter);
}

function fuseTalentNamesOfSameTypeEvenIfMissing(talent1, talent2, nameType) {
	if (talent1[nameType] && talent2[nameType])
		return fuseTalentNamesOfSameType(talent1, talent2, nameType);
	const name = talent1[nameType] || talent2[nameType];
	if (name)
		return changeFirstCharToUppercase(name);
}

function fuseTalentFullNames(talent1, talent2) {
	if (talent1 === talent2)
		return getTalentFullName(talent1);
	return {
		lastName: fuseTalentNamesOfSameTypeEvenIfMissing(talent1, talent2, nameType.LAST_NAME),
		firstName: fuseTalentNamesOfSameTypeEvenIfMissing(talent1, talent2, nameType.FIRST_NAME)
	};
}

function fuseTalentFullNamesById(id1, id2) {
	return fuseTalentFullNames(
		talent.getTalentById(id1),
		talent.getTalentById(id2)
	);
}

function returnUndefinedStringOrArgument(string) {
	return string || "undefined";
}

function getFullNameString(talentOrFullName) {
	const fullNameString =
		changeFirstCharToUppercase(returnUndefinedStringOrArgument(talentOrFullName.lastName))
		+ " "
		+ changeFirstCharToUppercase(returnUndefinedStringOrArgument(talentOrFullName.firstName));
	return fullNameString;
}

function printNameFusionFormatted(talent1, talent2, fullName) {
	const talent1FullName = getFullNameString(talent1);
	const talent2FullName = getFullNameString(talent2);
	const fusionFullName = getFullNameString(fullName);
	console.log(talent1FullName + " + " + talent2FullName + " = " + fusionFullName);
}

function printAllNameVariationsForTalent(talentId) {
	const talentIds = talent.getTalentIdsAll();
	for (const currentId of talentIds) {
		if (talentId === currentId)
			continue;
		const talent1 = talent.getTalentById(talentId);
		const talent2 = talent.getTalentById(currentId);
		let fullName = fuseTalentFullNames(talent1, talent2);
		printNameFusionFormatted(talent1, talent2, fullName);
		fullName = fuseTalentFullNames(talent2, talent1);
		printNameFusionFormatted(talent2, talent1, fullName);
	}
}

function printAllNameVariations() {
	const talentIds = talent.getTalentIdsAll();
	for (let i = 0; i < talentIds.length; i++) {
		for (let j = i+1; j < talentIds.length; j++) {
			const talent1 = talent.getTalentById(talentIds[i]);
			const talent2 = talent.getTalentById(talentIds[j]);
			let fullName = fuseTalentFullNames(talent1, talent2);
			printNameFusionFormatted(talent1, talent2, fullName);
			fullName = fuseTalentFullNames(talent2, talent1);
			printNameFusionFormatted(talent2, talent1, fullName);
		}
	}
}

module.exports = {
	fuseNameChunks,
	fuseTalentFullNames,
	fuseTalentFullNamesById,
	printAllNameVariationsForTalent,
	printAllNameVariations
};
