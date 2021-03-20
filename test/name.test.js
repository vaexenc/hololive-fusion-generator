const name = require("../src/name");
const talent = require("../src/talent");

describe("fuseNameChunks()", () => {
	it("creates 'Takamori' from 'taka' and 'mori'", () => {
		expect(name.fuseNameChunks("taka", "mori")).toBe("Takamori");
	});

	it("creates 'Inara' from 'ina' and 'ara' (same letter in the middle)", () => {
		expect(name.fuseNameChunks("ina", "ara")).toBe("Inara");
	});
});

describe("fuseTalentLastNames()", () => {
	it("creates 'Inumata' from korone and okayu", () => {
		const lastName = name.fuseTalentLastNames(
			talent.getTalentByID("korone"),
			talent.getTalentByID("okayu")
		);
		expect(lastName).toBe("Inumata");
	});

	it("creates 'Nekogami' from okayu and korone", () => {
		const lastName = name.fuseTalentLastNames(
			talent.getTalentByID("okayu"),
			talent.getTalentByID("korone")
		);
		expect(lastName).toBe("Nekogami");
	});
});

describe("fuseTalentFirstNames()", () => {
	it("creates 'Korokayu' from korone and okayu", () => {
		const firstName = name.fuseTalentFirstNames(
			talent.getTalentByID("korone"),
			talent.getTalentByID("okayu")
		);
		expect(firstName).toBe("Korokayu");
	});

	it("creates 'Okarone' from okayu and korone", () => {
		const firstName = name.fuseTalentFirstNames(
			talent.getTalentByID("okayu"),
			talent.getTalentByID("korone")
		);
		expect(firstName).toBe("Okarone");
	});
});

describe("fuseTalentFullNames()", () => {
	it("returns name unchanged when both talents are the same", () => {
		const fullName = name.fuseTalentFullNames(
			talent.getTalentByID("gura"),
			talent.getTalentByID("gura")
		);
		expect(fullName).toEqual({lastName: "Gawr", firstName: "Gura"});
	});
});

describe("fuseTalentFullNamesByID()", () => {
	it("returns name unchanged when both talents are the same", () => {
		const fullName = name.fuseTalentFullNamesByID("gura", "gura");
		expect(fullName).toEqual({lastName: "Gawr", firstName: "Gura"});
	});

	it("creates 'Shishimaki Botame' from botan and watame", () => {
		const fullName = name.fuseTalentFullNamesByID("botan", "watame");
		expect(fullName).toEqual({lastName: "Shishimaki", firstName: "Botame"});
	});

	it("creates 'Tsunoshiro Watatan' from watame and botan", () => {
		const fullName = name.fuseTalentFullNamesByID("watame", "botan");
		expect(fullName).toEqual({lastName: "Tsunoshiro", firstName: "Watatan"});
	});

	it("creates 'Takamori Killiope' from kiara and calli", () => {
		const fullName = name.fuseTalentFullNamesByID("kiara", "calli");
		expect(fullName).toEqual({lastName: "Takamori", firstName: "Killiope"});
	});

	it("creates 'Morinashi Calliara' from calli and kiara", () => {
		const fullName = name.fuseTalentFullNamesByID("calli", "kiara");
		expect(fullName).toEqual({lastName: "Morinashi", firstName: "Calliara"});
	});

	it("creates 'Haachagoo' from haachama and yagoo (firstName)", () => {
		const fullName = name.fuseTalentFullNamesByID("haachama", "yagoo");
		expect(fullName).toEqual({lastName: undefined, firstName: "Haachagoo"});
	});

	it("creates 'Yachama' from yagoo and haachama (firstName)", () => {
		const fullName = name.fuseTalentFullNamesByID("yagoo", "haachama");
		expect(fullName).toEqual({lastName: undefined, firstName: "Yachama"});
	});

	it("creates 'AZboco' from azki and roboco (firstName)", () => {
		const fullName = name.fuseTalentFullNamesByID("azki", "roboco");
		expect(fullName).toEqual({lastName: undefined, firstName: "AZboco"});
	});

	it("creates 'RoboKi' from roboco and azki (firstName)", () => {
		const fullName = name.fuseTalentFullNamesByID("roboco", "azki");
		expect(fullName).toEqual({lastName: undefined, firstName: "RoboKi"});
	});

	// it("creates '?' from ame and haachama", () => {
	// 	const fullName = name.fuseFullNameOfTalentsByID("ame", "haachama");
	// 	expect(fullName).toEqual({lastName: "?", firstName: "Amechama"});
	// });

	// it("creates '?' from haachama and ame", () => {
	// 	const fullName = name.fuseFullNameOfTalentsByID("haachama", "ame");
	// 	expect(fullName).toEqual({lastName: "?", firstName: "Haachamelia"});
	// });
});
