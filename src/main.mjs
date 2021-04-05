import "./style.css";
import {backgroundImages} from "./backgroundImages.js";
import {getRandomInt, mod} from "./util.js";

const elemMain = document.querySelector(".main");
const elemResult = document.querySelector(".result-box");
const elemBackground = document.querySelector(".background");

let backgroundIndex;

function createAndInsertTalentSelectContainers() {
	const template = document.querySelector(".template-talent-select-box");
	const firstClone = template.content.cloneNode(true);
	const secondClone = template.content.cloneNode(true);
	firstClone.querySelector(".talent-select-box").classList.add("talent-select-box-1");
	secondClone.querySelector(".talent-select-box").classList.add("talent-select-box-2");
	elemMain.insertBefore(firstClone, elemResult);
	elemMain.appendChild(secondClone);
}

function setBackground(index) {
	backgroundIndex = index;
	elemBackground.style.backgroundImage = `url(images/backgrounds/${backgroundImages[index]})`;
}

function setBackgroundRandom() {
	setBackground(getRandomInt(backgroundImages.length));
}

function saveCurrentBackgroundIndex() {
	localStorage.setItem("backgroundIndex", backgroundIndex);
}

function loadSavedBackgroundIndex() {
	return localStorage.getItem("backgroundIndex");
}

function deleteSavedBackgroundIndex() {
	localStorage.removeItem("backgroundIndex");
}

function keepBackgroundIndexWithinBounds(index) {
	return mod(index, backgroundImages.length);
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
	if (saved)
		setBackground(saved);
	else
		setBackgroundRandom();
}

function main() {
	createAndInsertTalentSelectContainers();
	decideBackground();
}

main();
