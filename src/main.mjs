import "./style.css";
import {backgroundImages} from "./backgroundImages.js";
import {getRandomInt, mod} from "./util.js";

const $ = document.querySelector.bind(document);

const elemMain = $(".main");
const elemResult = $(".result-box");
const elemBackground = $(".background");
const elemInfo = $(".info");
const elemInfoButton = $(".info-button");

let backgroundIndex;

function createAndInsertTalentSelectContainers() {
	const template = $(".template-talent-select-box");
	const firstClone = template.content.cloneNode(true);
	const secondClone = template.content.cloneNode(true);
	firstClone.querySelector(".talent-select-box").classList.add("talent-select-box-1");
	secondClone.querySelector(".talent-select-box").classList.add("talent-select-box-2");
	elemMain.insertBefore(firstClone, elemResult);
	elemMain.appendChild(secondClone);
}

function deleteSavedBackgroundIndex() {
	localStorage.removeItem("backgroundIndex");
}

function setBackground(index) {
	backgroundIndex = index;
	elemBackground.style.backgroundImage = `url(images/backgrounds/${backgroundImages[index]})`;
}

function setBackgroundRandom() {
	setBackground(getRandomInt(backgroundImages.length));
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

function initBackground() {
	decideBackground();
	$(".background-forwards").onclick = () => cycleBackgroundForwards();
	$(".background-backwards").onclick = () => cycleBackgroundBackwards();
	$(".background-random").onclick = () => setBackgroundRandom();
}

function showInfo() {
	elemInfo.classList.remove("info--out");
	elemInfo.classList.add("info--in");
}

function hideInfo() {
	elemInfo.classList.remove("info--in");
	elemInfo.classList.add("info--out");
}

function initInfo() {
	const classList = elemInfo.classList;

	elemInfoButton.onclick = function(event) {
		if (classList.contains("info--in")) return;
		showInfo();
		event.stopPropagation();
	};

	window.onclick = function() {
		if (!classList.contains("info--in")) return;
		hideInfo();
	};

	elemInfo.onclick = function(event) {
		event.stopPropagation();
	};
}

function main() {
	createAndInsertTalentSelectContainers();
	initInfo();
	initBackground();
}

main();
