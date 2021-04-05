import "./style.css";
import {backgroundImages} from "./backgroundImages.js";
import {getRandomInt} from "./util.js";

const elemMain = document.querySelector(".main");
const elemResult = document.querySelector(".result-box");
const elemBackground = document.querySelector(".background");

function createAndInsertTalentSelectContainers() {
	const template = document.querySelector(".template-talent-select-box");
	const firstClone = template.content.cloneNode(true);
	const secondClone = template.content.cloneNode(true);
	firstClone.querySelector(".talent-select-box").classList.add("talent-select-box-1");
	secondClone.querySelector(".talent-select-box").classList.add("talent-select-box-2");
	elemMain.insertBefore(firstClone, elemResult);
	elemMain.appendChild(secondClone);
}

function getBackgroundCurrent() {
	return elemBackground.style.backgroundImage;
}

function setBackground(filename) {
	elemBackground.style.backgroundImage = `url(images/backgrounds/${filename})`;
}

function setBackgroundRandom() {
	setBackground(backgroundImages[getRandomInt(backgroundImages.length)]);
}

createAndInsertTalentSelectContainers();
setBackgroundRandom();
