function calculateVariations(n) {
	return n * n - n;
}

function getObjectLength(obj) {
	return Object.keys(obj).length;
}

function getRandomInt(maxExclusive) {
	return Math.floor(maxExclusive * Math.random());
}

function getRandomIntUnique(maxExclusive, restricted) {
	if (typeof restricted === "number") restricted = [restricted];
	let newRandomInt = restricted[0];
	while (restricted.includes(newRandomInt)) {
		newRandomInt = getRandomInt(maxExclusive);
	}
	return newRandomInt;
}

function mod(x, m) {
	return ((x % m) + m) % m;
}

module.exports = {
	calculateVariations,
	getObjectLength,
	getRandomInt,
	getRandomIntUnique,
	mod
};
