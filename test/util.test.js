const util = require("../src/util");

describe("calculateVariations()", () => {
	it("seems to work", () => {
		expect(util.calculateVariations(6)).toBe(30);
		expect(util.calculateVariations(10)).toBe(90);
		expect(util.calculateVariations(43)).toBe(1806);
	});
});

describe("getObjectLength()", () => {
	it("seems to work", () => {
		expect(util.getObjectLength({})).toBe(0);
		expect(util.getObjectLength({a: 123})).toBe(1);
		expect(util.getObjectLength({a: 123, b: 456})).toBe(2);
	});
});

describe("getRandomInt()", () => {
	it("returns 0 when argument is 0", () => {
		for (let i = 0; i < 100; i++)
			expect(util.getRandomInt(0)).toBe(0);
	});

	it("returns 0 when argument is 1", () => {
		for (let i = 0; i < 100; i++)
			expect(util.getRandomInt(1)).toBe(0);
	});

	it("doesn't return anything >= 5 when argument is 5", () => {
		for (let i = 0; i < 100; i++)
			expect(util.getRandomInt(5)).toBeLessThan(5);
	});
});

describe("getRandomIntUnique()", () => {
	it("returns a unique random number", () => {
		for (let i = 0; i < 100; i++)
			expect(util.getRandomIntUnique(2, 1)).not.toBe(1);
		for (let i = 0; i < 100; i++)
			expect(util.getRandomIntUnique(3, 2)).not.toBe(2);
		for (let i = 0; i < 100; i++)
			expect(util.getRandomIntUnique(5, [0, 1, 2, 3])).toBe(4);
	});
});

describe("mod()", () => {
	it("returns 0 when mod(0, 10)", () => {
		expect(util.mod(0, 10)).toBe(0);
	});

	it("returns 5 when mod(5, 10)", () => {
		expect(util.mod(5, 10)).toBe(5);
	});

	it("returns 0 when mod(10, 10)", () => {
		expect(util.mod(10, 10)).toBe(0);
	});

	it("returns 0 when mod(30, 10)", () => {
		expect(util.mod(30, 10)).toBe(0);
	});

	it("returns 9 when mod(-1, 10)", () => {
		expect(util.mod(-1, 10)).toBe(9);
	});

	it("returns 1 when mod(-9, 10)", () => {
		expect(util.mod(-9, 10)).toBe(1);
	});

	it("returns 0 when mod(-20, 10)", () => {
		expect(util.mod(-20, 10)).toBe(0);
	});

	it("returns 6 when mod(-34, 10)", () => {
		expect(util.mod(-34, 10)).toBe(6);
	});
});
