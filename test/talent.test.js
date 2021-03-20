const talent = require("../src/talent");
const util = require("../src/util");

describe("getTalentByID()", () => {
	it("always returns the same object when called with the same id", () => {
		expect(talent.getTalentByID("coco")).toEqual(talent.getTalentByID("coco"));
	});

	it("throws when talent with given id doesn't exist", () => {
		expect(() => talent.getTalentByID("")).toThrow();
		expect(() => talent.getTalentByID(" ")).toThrow();
		expect(() => talent.getTalentByID("1")).toThrow();
		expect(() => talent.getTalentByID("abcdefg")).toThrow();
	});

	it("works with 'calli'", () => {
		const t = talent.getTalentByID("calli");
		expect(t.lastName).toEqual("mori");
		expect(t.firstName).toEqual("calliope");
	});

	it("works with 'ina'", () => {
		const t = talent.getTalentByID("ina");
		expect(t.lastName).toEqual("ninomae");
		expect(t.firstName).toEqual("ina'nis");
	});

	it("works with 'ame'", () => {
		const t = talent.getTalentByID("ame");
		expect(t.lastName).toEqual("watson");
		expect(t.firstName).toEqual("amelia");
	});

	it("works with 'pekora'", () => {
		const t = talent.getTalentByID("pekora");
		expect(t.lastName).toEqual("usada");
		expect(t.firstName).toEqual("pekora");
	});

	it("doesn't return an array", () => {
		const t = talent.getTalentByID("pekora");
		expect(Array.isArray(t)).toBe(false);
	});

	it("returns an object", () => {
		const t = talent.getTalentByID("pekora");
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

describe("getIDsOfEnabledTalents()", () => {
	const enabledTalentIDs = talent.getIDsOfEnabledTalents();

	it("returns an array", () => {
		expect(Array.isArray(enabledTalentIDs)).toBe(true);
	});

	it("has a length equal to getAmountOfEnabledTalents()", () => {
		expect(enabledTalentIDs.length).toBe(talent.getAmountOfEnabledTalents());
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

describe("getAmountOfTalentVariations()", () => {
	it("returns the same thing as when calculating manually", () => {
		expect(talent.getAmountOfTalentVariations())
		.toBe(util.getAmountOfVariations(talent.getAmountOfEnabledTalents(), 2));
	});
});
