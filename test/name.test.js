const name = require("../src/name");
const talent = require("../src/talent");

describe("fuseNames()", () => {
	it("creates 'Takamori' from 'taka' and 'mori'", () => {
		expect(name.fuseNames("taka", "mori")).toBe("Takamori");
	});

	it("creates 'Inara' from 'ina' and 'ara' (same letter in the middle)", () => {
		expect(name.fuseNames("ina", "ara")).toBe("Inara");
	});
});

describe("fuseLastNamesOfTalents()", () => {
	it("creates 'Inumata' from korone and okayu", () => {
		const lastName = name.fuseLastNamesOfTalents(
			talent.getTalentByID("korone"),
			talent.getTalentByID("okayu")
		);
		expect(lastName).toBe("Inumata");
	});

	it("creates 'Nekogami' from okayu and korone", () => {
		const lastName = name.fuseLastNamesOfTalents(
			talent.getTalentByID("okayu"),
			talent.getTalentByID("korone")
		);
		expect(lastName).toBe("Nekogami");
	});
});

describe("fuseFirstNamesOfTalents()", () => {
	it("creates 'Korokayu' from korone and okayu", () => {
		const firstName = name.fuseFirstNamesOfTalents(
			talent.getTalentByID("korone"),
			talent.getTalentByID("okayu")
		);
		expect(firstName).toBe("Korokayu");
	});

	it("creates 'Okarone' from okayu and korone", () => {
		const firstName = name.fuseFirstNamesOfTalents(
			talent.getTalentByID("okayu"),
			talent.getTalentByID("korone")
		);
		expect(firstName).toBe("Okarone");
	});
});

describe("fuseFullNameOfTalents()", () => {
	it("returns name unchanged when both talents are the same", () => {
		const fullName = name.fuseFullNameOfTalents(
			talent.getTalentByID("gura"),
			talent.getTalentByID("gura")
		);
		expect(fullName).toEqual({lastName: "Gawr", firstName: "Gura"});
	});
});

describe("fuseFullNameOfTalentsByID()", () => {
	it("returns name unchanged when both talents are the same", () => {
		const fullName = name.fuseFullNameOfTalentsByID("gura", "gura");
		expect(fullName).toEqual({lastName: "Gawr", firstName: "Gura"});
	});

	it("creates 'Shishimaki Botame' from botan and watame", () => {
		const fullName = name.fuseFullNameOfTalentsByID("botan", "watame");
		expect(fullName).toEqual({lastName: "Shishimaki", firstName: "Botame"});
	});

	it("creates 'Tsunoshiro Watatan' from watame and botan", () => {
		const fullName = name.fuseFullNameOfTalentsByID("watame", "botan");
		expect(fullName).toEqual({lastName: "Tsunoshiro", firstName: "Watatan"});
	});

	it("creates 'Takamori Killiope' from kiara and calli", () => {
		const fullName = name.fuseFullNameOfTalentsByID("kiara", "calli");
		expect(fullName).toEqual({lastName: "Takamori", firstName: "Killiope"});
	});

	it("creates 'Morinashi Calliara' from calli and kiara", () => {
		const fullName = name.fuseFullNameOfTalentsByID("calli", "kiara");
		expect(fullName).toEqual({lastName: "Morinashi", firstName: "Calliara"});
	});

	it("creates 'Haachagoo' from haachama and yagoo (firstName)", () => {
		const fullName = name.fuseFullNameOfTalentsByID("haachama", "yagoo");
		expect(fullName).toEqual({lastName: undefined, firstName: "Haachagoo"});
	});

	it("creates 'Yachama' from yagoo and haachama (firstName)", () => {
		const fullName = name.fuseFullNameOfTalentsByID("yagoo", "haachama");
		expect(fullName).toEqual({lastName: undefined, firstName: "Yachama"});
	});

	it("creates 'AZboco' from azki and roboco (firstName)", () => {
		const fullName = name.fuseFullNameOfTalentsByID("azki", "roboco");
		expect(fullName).toEqual({lastName: undefined, firstName: "AZboco"});
	});

	it("creates 'RoboKi' from roboco and azki (firstName)", () => {
		const fullName = name.fuseFullNameOfTalentsByID("roboco", "azki");
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
