function factorial(number) {
	if (!Number.isInteger(number))
		throw new Error("number must be an integer");
	if (number < 0)
		throw new Error("number must be positive");
	if (number === 0)
		return 1;
	return number * factorial(number - 1);
}

function calculateVariations(totalElements, elementsToChoose) {
	// order important, no repetitions
	return factorial(totalElements) / factorial(totalElements - elementsToChoose);
}

function getObjectLength(obj) {
	return Object.keys(obj).length;
}

function getRandomInt(max) {
	return Math.floor(max * Math.random());
}

module.exports = {
	factorial,
	calculateVariations,
	getObjectLength,
	getRandomInt
};
