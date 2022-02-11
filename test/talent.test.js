const talent = require("../src/js/lib/talent");
const util = require("../src/js/lib/util");

describe("getTalentById()", () => {
	it("always returns the same object when called with the same id", () => {
		expect(talent.getTalentById("gura")).toEqual(talent.getTalentById("gura"));
	});

	it("throws when talent with given id doesn't exist", () => {
		expect(() => talent.getTalentById("")).toThrow();
		expect(() => talent.getTalentById(" ")).toThrow();
		expect(() => talent.getTalentById("1")).toThrow();
		expect(() => talent.getTalentById("abcdefg")).toThrow();
	});

	it("works with 'calli'", () => {
		const t = talent.getTalentById("calli");
		expect(t.name.last).toEqual("mori");
		expect(t.name.first).toEqual("calliope");
	});

	it("works with 'ina'", () => {
		const t = talent.getTalentById("ina");
		expect(t.name.last).toEqual("ninomae");
		expect(t.name.first).toEqual("ina'nis");
	});

	it("works with 'ame'", () => {
		const t = talent.getTalentById("gura");
		expect(t.name.last).toEqual("gawr");
		expect(t.name.first).toEqual("gura");
	});

	it("works with 'pekora'", () => {
		const t = talent.getTalentById("pekora");
		expect(t.name.last).toEqual("usada");
		expect(t.name.first).toEqual("pekora");
	});

	it("doesn't return an array", () => {
		const t = talent.getTalentById("pekora");
		expect(Array.isArray(t)).toBe(false);
	});

	it("returns an object", () => {
		const t = talent.getTalentById("pekora");
		expect(typeof t).toBe("object");
	});
});

describe("getTalentIdsEnabled()", () => {
	const enabledTalentIds = talent.getTalentIdsEnabled();

	it("returns an array", () => {
		expect(Array.isArray(enabledTalentIds)).toBe(true);
	});

	it("has a length equal to getTalentCountEnabled()", () => {
		expect(enabledTalentIds.length).toBe(talent.getTalentCountEnabled());
	});
});

describe("getTalentCountEnabled()", () => {
	const amountOfEnabledTalents = talent.getTalentCountEnabled();
	const amountOfTalents = talent.getTalentCountAll();

	it("should be greater than or equal to 0", () => {
		expect(amountOfEnabledTalents).toBeGreaterThanOrEqual(0);
	});

	it("should probably be greater than 0", () => {
		expect(amountOfEnabledTalents).toBeGreaterThan(0);
	});

	it("should be less than or equal to total amount of talents", () => {
		expect(amountOfEnabledTalents).toBeLessThanOrEqual(amountOfTalents);
	});
});

describe("calculateTalentVariationsEnabled()", () => {
	it("returns the same thing as when calculating manually", () => {
		expect(talent.calculateTalentVariationsEnabled()).toBe(
			util.calculateVariations(talent.getTalentCountEnabled())
		);
	});
});

describe("calculateTalentVariationsAll()", () => {
	it("returns the same thing as when calculating manually", () => {
		expect(talent.calculateTalentVariationsAll()).toBe(
			util.calculateVariations(talent.getTalentCountAll())
		);
	});
});

describe("getTalentIdsAll()", () => {
	it("has a length equal to getTalentCountAll()", () => {
		const talentIds = talent.getTalentIdsAll();
		expect(talentIds.length).toBe(talent.getTalentCountAll());
	});
});
