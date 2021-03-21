const name = require("../src/name");
const talent = require("../src/talent");

describe("fuseTalentFullNamesById()", () => {
	it("returns name unchanged when both talents are the same", () => {
		const fullName = name.fuseTalentFullNamesById("gura", "gura");
		expect(fullName).toEqual({lastName: "Gawr", firstName: "Gura"});
	});

	it("creates 'Shishimaki Botame' from botan and watame", () => {
		const fullName = name.fuseTalentFullNamesById("botan", "watame");
		expect(fullName).toEqual({lastName: "Shishimaki", firstName: "Botame"});
	});

	it("creates 'Tsunoshiro Watatan' from watame and botan", () => {
		const fullName = name.fuseTalentFullNamesById("watame", "botan");
		expect(fullName).toEqual({lastName: "Tsunoshiro", firstName: "Watatan"});
	});

	it("creates 'Takamori Killiope' from kiara and calli", () => {
		const fullName = name.fuseTalentFullNamesById("kiara", "calli");
		expect(fullName).toEqual({lastName: "Takamori", firstName: "Killiope"});
	});

	it("creates 'Morinashi Calliara' from calli and kiara", () => {
		const fullName = name.fuseTalentFullNamesById("calli", "kiara");
		expect(fullName).toEqual({lastName: "Morinashi", firstName: "Calliara"});
	});

	it("creates 'Haachagoo' from haachama and yagoo (firstName)", () => {
		const fullName = name.fuseTalentFullNamesById("haachama", "yagoo");
		expect(fullName).toEqual({lastName: undefined, firstName: "Haachagoo"});
	});

	it("creates 'Yachama' from yagoo and haachama (firstName)", () => {
		const fullName = name.fuseTalentFullNamesById("yagoo", "haachama");
		expect(fullName).toEqual({lastName: undefined, firstName: "Yachama"});
	});

	it("creates 'AZboco' from azki and roboco (firstName)", () => {
		const fullName = name.fuseTalentFullNamesById("azki", "roboco");
		expect(fullName).toEqual({lastName: undefined, firstName: "AZboco"});
	});

	it("creates 'RoboKi' from roboco and azki (firstName)", () => {
		const fullName = name.fuseTalentFullNamesById("roboco", "azki");
		expect(fullName).toEqual({lastName: undefined, firstName: "RoboKi"});
	});

	it("creates 'Watson Amechama' from ame and haachama", () => {
		const fullName = name.fuseTalentFullNamesById("ame", "haachama");
		expect(fullName).toEqual({lastName: "Watson", firstName: "Amechama"});
	});

	it("creates 'Watson Haachamelia' from haachama and ame", () => {
		const fullName = name.fuseTalentFullNamesById("haachama", "ame");
		expect(fullName).toEqual({lastName: "Watson", firstName: "Haachamelia"});
	});
});

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
			talent.getTalentById("korone"),
			talent.getTalentById("okayu")
		);
		expect(lastName).toBe("Inumata");
	});

	it("creates 'Nekogami' from okayu and korone", () => {
		const lastName = name.fuseTalentLastNames(
			talent.getTalentById("okayu"),
			talent.getTalentById("korone")
		);
		expect(lastName).toBe("Nekogami");
	});
});

describe("fuseTalentFirstNames()", () => {
	it("creates 'Korokayu' from korone and okayu", () => {
		const firstName = name.fuseTalentFirstNames(
			talent.getTalentById("korone"),
			talent.getTalentById("okayu")
		);
		expect(firstName).toBe("Korokayu");
	});

	it("creates 'Okarone' from okayu and korone", () => {
		const firstName = name.fuseTalentFirstNames(
			talent.getTalentById("okayu"),
			talent.getTalentById("korone")
		);
		expect(firstName).toBe("Okarone");
	});
});

describe("fuseTalentFullNames()", () => {
	it("returns name unchanged when both talents are the same", () => {
		const fullName = name.fuseTalentFullNames(
			talent.getTalentById("gura"),
			talent.getTalentById("gura")
		);
		expect(fullName).toEqual({lastName: "Gawr", firstName: "Gura"});
	});
});

describe("printAllNameVariationsForTalent()", () => {
	it("calls console.log() the correct amount of times", () => {
		const logSpy = jest.spyOn(console, "log").mockImplementation();
		name.printAllNameVariationsForTalent("gura");
		expect(logSpy).toHaveBeenCalledTimes((talent.getAmountOfTalents() - 1) * 2);
		logSpy.mockRestore();
	});
});

describe("printAllNameVariations()", () => {
	it("calls console.log() the correct amount of times", () => {
		const logSpy = jest.spyOn(console, "log").mockImplementation();
		name.printAllNameVariations("gura");
		expect(logSpy).toHaveBeenCalledTimes(talent.getAmountOfTotalTalentVariations());
		logSpy.mockRestore();
	});
});
