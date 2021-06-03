// val-loader executable

const fs = require("fs");

function getBgFileNumber(fileName) {
	return parseInt(fileName.match(/^bg(\d+)\.(jpg|png|webp)/)[1]);
}

function bgFilenameSort(a, b) {
	if (getBgFileNumber(a) < getBgFileNumber(b))
		return -1;
	return 1;
}

const bgFilenames = fs.readdirSync("./dist/images/backgrounds");
const bgFilenamesSorted = bgFilenames.sort(bgFilenameSort);

module.exports = () => {
	return {
		code: `module.exports = {
			backgroundImages: ${JSON.stringify(bgFilenamesSorted)}
		}`
	};
};
