const talent = require("../src/talent");
const util = require("../src/util");

describe("getTalentById()", () => {
	it("always returns the same object when called with the same id", () => {
		expect(talent.getTalentById("coco")).toEqual(talent.getTalentById("coco"));
	});

	it("throws when talent with given id doesn't exist", () => {
		expect(() => talent.getTalentById("")).toThrow();
		expect(() => talent.getTalentById(" ")).toThrow();
		expect(() => talent.getTalentById("1")).toThrow();
		expect(() => talent.getTalentById("abcdefg")).toThrow();
	});

	it("works with 'calli'", () => {
		const t = talent.getTalentById("calli");
		expect(t.lastName).toEqual("mori");
		expect(t.firstName).toEqual("calliope");
	});

	it("works with 'ina'", () => {
		const t = talent.getTalentById("ina");
		expect(t.lastName).toEqual("ninomae");
		expect(t.firstName).toEqual("ina'nis");
	});

	it("works with 'ame'", () => {
		const t = talent.getTalentById("ame");
		expect(t.lastName).toEqual("watson");
		expect(t.firstName).toEqual("amelia");
	});

	it("works with 'pekora'", () => {
		const t = talent.getTalentById("pekora");
		expect(t.lastName).toEqual("usada");
		expect(t.firstName).toEqual("pekora");
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

describe("getAmountOfTalents()", () => {
	const amountOfTalents = talent.getAmountOfTalents();

	it("should be greater than 40", () => {
		expect(amountOfTalents).toBeGreaterThan(40);
	});

	it("should be less than 100", () => {
		expect(amountOfTalents).toBeLessThan(100);
	});
});

describe("getIdsOfEnabledTalents()", () => {
	const enabledTalentIds = talent.getIdsOfEnabledTalents();

	it("returns an array", () => {
		expect(Array.isArray(enabledTalentIds)).toBe(true);
	});

	it("has a length equal to getAmountOfEnabledTalents()", () => {
		expect(enabledTalentIds.length).toBe(talent.getAmountOfEnabledTalents());
	});
});

describe("getAmountOfEnabledTalents()", () => {
	const amountOfEnabledTalents = talent.getAmountOfEnabledTalents();
	const amountOfTalents = talent.getAmountOfTalents();

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

describe("getAmountOfEnabledTalentVariations()", () => {
	it("returns the same thing as when calculating manually", () => {
		expect(talent.getAmountOfEnabledTalentVariations())
		.toBe(util.getAmountOfVariations(talent.getAmountOfEnabledTalents(), 2));
	});
});
