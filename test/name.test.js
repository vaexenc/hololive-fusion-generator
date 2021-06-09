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

	it("creates 'Takamori Kialliope' from kiara and calli", () => {
		const fullName = name.fuseTalentFullNamesById("kiara", "calli");
		expect(fullName).toEqual({lastName: "Takamori", firstName: "Kialliope"});
	});

	it("creates 'Morinashi Calliara' from calli and kiara", () => {
		const fullName = name.fuseTalentFullNamesById("calli", "kiara");
		expect(fullName).toEqual({lastName: "Morinashi", firstName: "Calliara"});
	});

	it("creates 'AZboco' from azki and roboco (firstName)", () => {
		const fullName = name.fuseTalentFullNamesById("azki", "roboco");
		expect(fullName).toEqual({lastName: undefined, firstName: "AZboco"});
	});

	it("creates 'RoboKi' from roboco and azki (firstName)", () => {
		const fullName = name.fuseTalentFullNamesById("roboco", "azki");
		expect(fullName).toEqual({lastName: undefined, firstName: "RoboKi"});
	});

	it("creates 'Watson Ameboco' from ame and roboco", () => {
		const fullName = name.fuseTalentFullNamesById("ame", "roboco");
		expect(fullName).toEqual({lastName: "Watson", firstName: "Ameboco"});
	});

	it("creates 'Watson Robomelia' from roboco and ame", () => {
		const fullName = name.fuseTalentFullNamesById("roboco", "ame");
		expect(fullName).toEqual({lastName: "Watson", firstName: "Robomelia"});
	});

	it("creates 'Ninonashi Inara' from ina and kiara", () => {
		const fullName = name.fuseTalentFullNamesById("ina", "kiara");
		expect(fullName).toEqual({lastName: "Ninonashi", firstName: "Inara"});
	});

	it("creates 'Gawrkino Gusora' from gura and sora", () => {
		const fullName = name.fuseTalentFullNamesById("gura", "sora");
		expect(fullName).toEqual({lastName: "Gawrkino", firstName: "Gusora"});
	});

	it("creates 'Tokigawr Sogura' from sora and gura", () => {
		const fullName = name.fuseTalentFullNamesById("sora", "gura");
		expect(fullName).toEqual({lastName: "Tokigawr", firstName: "Sogura"});
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
		expect(logSpy).toHaveBeenCalledTimes((talent.getTalentCountAll() - 1) * 2);
		logSpy.mockRestore();
	});
});

describe("printAllNameVariations()", () => {
	it("calls console.log() the correct amount of times", () => {
		const logSpy = jest.spyOn(console, "log").mockImplementation();
		name.printAllNameVariations("gura");
		expect(logSpy).toHaveBeenCalledTimes(talent.calculateTalentVariationsAll());
		logSpy.mockRestore();
	});
});
