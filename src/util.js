function factorial(number) {
	if (!Number.isInteger(number))
		throw new Error("number must be an integer");
	if (number < 0)
		throw new Error("number must be positive");
	if (number === 0)
		return 1;
	return number * factorial(number - 1);
}

function getAmountOfVariations(totalElements, elementsToChoose) {
	// order important, no repetitions
	return factorial(totalElements) / factorial(totalElements - elementsToChoose);
}

function getLengthOfObject(obj) {
	return Object.keys(obj).length;
}

module.exports = {
	factorial,
	getAmountOfVariations,
	getLengthOfObject
};
