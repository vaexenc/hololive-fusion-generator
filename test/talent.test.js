const talent = require("../src/talent");

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
});
