const util = require("../src/util");

describe("factorial()", () => {
	it("works for numbers from 0 to 10", () => {
		expect(util.factorial(0)).toBe(1);
		expect(util.factorial(1)).toBe(1);
		expect(util.factorial(2)).toBe(2);
		expect(util.factorial(3)).toBe(6);
		expect(util.factorial(4)).toBe(24);
		expect(util.factorial(5)).toBe(120);
		expect(util.factorial(6)).toBe(720);
		expect(util.factorial(7)).toBe(5040);
		expect(util.factorial(8)).toBe(40320);
		expect(util.factorial(9)).toBe(362880);
		expect(util.factorial(10)).toBe(3628800);
	});

	it("throws when number is not an integer", () => {
		expect(() => util.factorial()).toThrow("int");
		expect(() => util.factorial("")).toThrow();
		expect(() => util.factorial({})).toThrow();
		expect(() => util.factorial([])).toThrow();
		expect(() => util.factorial("1")).toThrow();
	});

	it("throws when number negative", () => {
		expect(() => util.factorial(-1)).toThrow(/positive|negative/);
		expect(() => util.factorial(-10)).toThrow();
	});
});

describe("calculateVariations()", () => {
	it("seems to work", () => {
		expect(util.calculateVariations(10, 1)).toBe(10);
		expect(util.calculateVariations(10, 2)).toBe(90);
		expect(util.calculateVariations(10, 3)).toBe(720);
		expect(util.calculateVariations(50, 2)).toBe(2450);
		expect(util.calculateVariations(100, 4)).toBe(94109400);
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
