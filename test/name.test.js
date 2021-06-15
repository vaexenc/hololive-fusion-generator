const name = require("../src/name");
const talent = require("../src/talent");

describe("getFullNameStringById()", () => {
	it("returns 'Gawr Gura' on 'gura'", () => {
		expect(name.getFullNameStringById("gura")).toBe("Gawr Gura");
	});
});

describe("getFusionStringByIds()", () => {
	it("returns name unchanged when both talents are the same", () => {
		expect(name.getFusionStringByIds("gura", "gura")).toBe("Gawr Gura");
	});

	it("creates 'Takamori Kialliope' from kiara and calli", () => {
		expect(name.getFusionStringByIds("kiara", "calli")).toBe("Takamori Kialliope");
	});

	it("creates 'Morinashi Calliara' from calli and kiara", () => {
		expect(name.getFusionStringByIds("calli", "kiara")).toBe("Morinashi Calliara");
	});

	it("creates 'Ninonashi Inara' from ina and kiara", () => {
		expect(name.getFusionStringByIds("ina", "kiara")).toBe("Ninonashi Inara");
	});

	it("creates 'Usagawr Pekogura' from pekora and gura", () => {
		expect(name.getFusionStringByIds("pekora", "gura")).toBe("Usagawr Pekogura");
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
