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

describe("getAmountOfVariations()", () => {
	it("seems to work", () => {
		expect(util.getAmountOfVariations(10, 1)).toBe(10);
		expect(util.getAmountOfVariations(10, 2)).toBe(90);
		expect(util.getAmountOfVariations(10, 3)).toBe(720);
		expect(util.getAmountOfVariations(50, 2)).toBe(2450);
		expect(util.getAmountOfVariations(100, 4)).toBe(94109400);
	});
});

describe("getLengthOfObject()", () => {
	it("seems to work", () => {
		expect(util.getLengthOfObject({})).toBe(0);
		expect(util.getLengthOfObject({a: 123})).toBe(1);
		expect(util.getLengthOfObject({a: 123, b: 456})).toBe(2);
	});
});
