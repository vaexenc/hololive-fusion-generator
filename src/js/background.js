import {$} from "./browser-util.js";
import {backgroundImages} from "./lib/backgroundImages.js";
import {getRandomInt, getRandomIntUnique, mod} from "./lib/util.js";

let backgroundIndex;

function deleteSavedBackgroundIndex() {
	localStorage.removeItem("backgroundIndex");
}

function setBackground(index) {
	backgroundIndex = index;
	$(".background").style.setProperty("--image-url", `url(images/backgrounds/${backgroundImages[index]})`);
}

function setBackgroundRandom() {
	setBackground(getRandomInt(backgroundImages.length));
	deleteSavedBackgroundIndex();
}

function setBackgroundRandomDifferent() {
	const newBackgroundIndex = getRandomIntUnique(backgroundImages.length, backgroundIndex);
	setBackground(newBackgroundIndex);
	deleteSavedBackgroundIndex();
}

function saveCurrentBackgroundIndex() {
	localStorage.setItem("backgroundIndex", backgroundIndex);
}

function loadSavedBackgroundIndex() {
	const index = localStorage.getItem("backgroundIndex");
	if (typeof index === "string" && index.match(/^\d+/))
		return parseInt(index);
}

function keepBackgroundIndexWithinBounds(index) {
	return mod(index, backgroundImages.length);
}

function isBackgroundIndexValid(index) {
	if (typeof index !== "number" || index < 0 || index >= backgroundImages.length)
		return false;
	return true;
}

function cycleBackgroundForwards() {
	backgroundIndex = keepBackgroundIndexWithinBounds(++backgroundIndex);
	setBackground(backgroundIndex);
	saveCurrentBackgroundIndex(backgroundIndex);
}

function cycleBackgroundBackwards() {
	backgroundIndex = keepBackgroundIndexWithinBounds(--backgroundIndex);
	setBackground(backgroundIndex);
	saveCurrentBackgroundIndex(backgroundIndex);
}

function decideBackground() {
	const saved = loadSavedBackgroundIndex();
	if (!isBackgroundIndexValid(saved))
		setBackgroundRandom();
	else
		setBackground(saved);
}

export {
	cycleBackgroundForwards,
	cycleBackgroundBackwards,
	setBackgroundRandomDifferent,
	decideBackground
};
