import talentList from "./talent-list.mjs";

class Name {
	constructor(name) {
		if (!name) return;
		if (name.constructor.name === "Array") this._syllables = name;
		else if (name.constructor.name === "String") this._name = name;
	}

	get syllables() {
		if (!this._syllables || this._syllables.length === 0) return null;
		return this._syllables;
	}

	set syllables(_) {
		throw "";
	}

	get name() {
		if (this._name) return this._name;
		if (!this._syllables) return "";
		return this._syllables.join("");
	}

	set name(_) {
		throw "";
	}
}

class FullName {
	constructor(firstName, lastName) {
		this._firstName = new Name(firstName);
		this._lastName = new Name(lastName);
	}

	get first() {
		return this._firstName.name;
	}

	get last() {
		return this._lastName.name;
	}

	get full() {
		return [this._lastName.name, this._firstName.name].join(" ").trim();
	}

	get fullWestern() {
		return [this._firstName.name, this._lastName.name].join(" ").trim();
	}
}

function decapitalizeFirstSyllable(syllables) {
	return syllables.map((value, index) => {
		if (index === 0) return value.charAt(0).toLowerCase() + value.slice(1);
		return value;
	});
}

function fuseSyllables(syllables1, syllables2) {
	const
		s1 = syllables1,
		s2 = syllables2,
		s1l = s1.length,
		s2l = s2.length,
		maxLength = Math.max(s1l, s2l);
	return s1.slice(0, maxLength/2).join("") + decapitalizeFirstSyllable(s2).slice(-Math.ceil(maxLength/2)).join("");
}

function fuseNamesOfTalents(talent1, talent2) {
	if (talent1.id === talent2.id) {
		return new FullName(talent1.firstName, talent1.lastName);
	}

	// if there's only 1 name in each talent
	if (talent1.firstName && !talent1.lastName && talent2.firstName && !talent2.lastName) {
		return new FullName(fuseSyllables(talent1.firstName, talent2.firstName));
	}
	if (talent1.firstName && !talent1.lastName && !talent2.firstName && talent2.lastName) {
		return new FullName(fuseSyllables(talent1.firstName, talent2.lastName));
	}
	if (!talent1.firstName && talent1.lastName && talent2.firstName && !talent2.lastName) {
		return new FullName(fuseSyllables(talent1.lastName, talent2.firstName));
	}
	if (!talent1.firstName && talent1.lastName && !talent2.firstName && talent2.lastName) {
		return new FullName(null, fuseSyllables(talent1.lastName, talent2.lastName));
	}

	// if at least 1 talent has first and last name
	const result = {};
	for (const key of ["firstName", "lastName"]) {
		if (!talent1[key] !== !talent2[key]) { // xor, if only 1 object has the key
			result[key] = talent1[key] || talent2[key];
			continue;
		}
		result[key] = fuseSyllables(talent1[key], talent2[key]);
	}
	return new FullName(result.firstName, result.lastName);
}

function getTalentById(id) {
	return talentList.find(e => e.id === id);
}

function getFullNameFromTalent(talent) {
	return new FullName(talent.firstName, talent.lastName);
}

function getFullNameFromId(id) {
	return getFullNameFromTalent(getTalentById(id));
}

function printResult(talent1Name, talent2Name, fusedName) {
	console.log(`${talent1Name.full} + ${talent2Name.full} = ${fusedName.full}`);
}

function printAllFusions() {
	for (const talent1 of talentList) {
		for (const talent2 of talentList) {
			const talent1Name = getFullNameFromTalent(talent1);
			const talent2Name = getFullNameFromTalent(talent2);
			const fusedName = fuseNamesOfTalents(talent1, talent2);
			printResult(talent1Name, talent2Name, fusedName);
		}
	}
}

function printBothFusionsOfTwo(id1, id2) {
	const
		fullName1 = getFullNameFromId(id1),
		fullName2 = getFullNameFromId(id2),
		fusedName1 = fuseNamesOfTalents(getTalentById(id1), getTalentById(id2)),
		fusedName2 = fuseNamesOfTalents(getTalentById(id2), getTalentById(id1));
	printResult(fullName1, fullName2, fusedName1);
	printResult(fullName2, fullName1, fusedName2);
}

export {printAllFusions, printBothFusionsOfTwo};
