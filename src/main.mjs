import "./style.css";
import {backgroundImages} from "./backgroundImages.js";
import {getRandomInt, getRandomIntUnique, mod} from "./util.js";
import {getFullNameStringById, getFusionStringByIds} from "./name.js";
import {
	calculateTalentVariationsEnabled, getTalentCountEnabled, getTalentIdsEnabled
} from "./talent.js";

const $ = document.querySelector.bind(document);
const dropdownModifierSelectors = [
	".talent-dropdown",
	".talent-select-icons",
	".talent-select-name",
	".talent-select-image__image"
];
const talentIds = getTalentIdsEnabled();
const talentSelectContainers = [];
let backgroundIndex;

// ------------------------------------------------------------------
// GENERAL
// ------------------------------------------------------------------

function keepTalentIndexWithinBounds(talentIndex) {
	return mod(talentIndex, talentIds.length);
}

function cloneNode(template) {
	return template.content.cloneNode(true);
}

// ------------------------------------------------------------------
// TALENT SELECT, TALENT RESULT
// ------------------------------------------------------------------

function createAndInsertTalentSelectContainerElements() {
	const template = $(".template-talent-select");
	for (let i = 1; i <= 2; i++) {
		const clone = cloneNode(template);
		clone.querySelector(".talent-select-container").classList.add(`talent-select-container-${i}`);
		clone.querySelector(".talent-select-box").classList.add(`talent-select-box-${i}`);
		clone.querySelector(".talent-dropdown").classList.add(`talent-dropdown-${i}`);
		$(".main").appendChild(clone);
	}
}

function getTalentSelectContainerTalentIndex(talentSelectContainer) {
	return parseInt(talentSelectContainer.dataset.talentIndex);
}

function setTalentSelectContainerTalentIndex(talentSelectContainer, talentIndex) {
	talentSelectContainer.dataset.talentIndex = talentIndex;
}

function getTalentSelectContainerTalentIds() {
	return [
		talentIds[getTalentSelectContainerTalentIndex(talentSelectContainers[0])],
		talentIds[getTalentSelectContainerTalentIndex(talentSelectContainers[1])]
	];
}

function getOtherTalentSelectContainer(talentSelectContainer) {
	if (talentSelectContainer === talentSelectContainers[0])
		return talentSelectContainers[1];
	return talentSelectContainers[0];
}

function getTalentSelectContainerFromChild(element) {
	return element.closest(".talent-select-container");
}


function onClickTalentPrevious(event) {
	const talentSelectContainer = getTalentSelectContainerFromChild(event.target);
	setTalentSelectContainerTalentIndex(
		talentSelectContainer,
		keepTalentIndexWithinBounds(
			getTalentSelectContainerTalentIndex(talentSelectContainer) - 1
		)
	);
	update();
}

function onClickTalentNext(event) {
	const talentSelectContainer = getTalentSelectContainerFromChild(event.target);
	setTalentSelectContainerTalentIndex(
		talentSelectContainer,
		keepTalentIndexWithinBounds(
			getTalentSelectContainerTalentIndex(talentSelectContainer) + 1
		)
	);
	update();
}

function talentSelectContainerRandomize(talentSelectContainer) {
	if (talentIds.length <= 1) return;
	const talentIndex = getTalentSelectContainerTalentIndex(talentSelectContainer);
	let newTalentIndex;
	if (talentIds.length === 2) {
		newTalentIndex = keepTalentIndexWithinBounds(talentIndex + 1);
	} else {
		const otherTalentIndex = getTalentSelectContainerTalentIndex(
			getOtherTalentSelectContainer(talentSelectContainer)
		);
		newTalentIndex = getRandomIntUnique(talentIds.length, [talentIndex, otherTalentIndex]);
	}
	setTalentSelectContainerTalentIndex(talentSelectContainer, newTalentIndex);
	update();
}

function onClickTalentRandom(event) {
	const talentSelectContainer = getTalentSelectContainerFromChild(event.target);
	talentSelectContainerRandomize(talentSelectContainer);
}

function onClickRandomBoth() {
	if (talentIds.length <= 1) return;
	const oldTalentIndex1 = getTalentSelectContainerTalentIndex(talentSelectContainers[0]);
	const newTalentIndex1 = getRandomIntUnique(talentIds.length, oldTalentIndex1);
	const oldTalentIndex2 = getTalentSelectContainerTalentIndex(talentSelectContainers[1]);
	let newTalentIndex2 = oldTalentIndex2;
	if (talentIds.length === 2) {
		newTalentIndex2 = keepTalentIndexWithinBounds(newTalentIndex1 + 1);
	} else {
		newTalentIndex2 = getRandomIntUnique(talentIds.length, [oldTalentIndex2, newTalentIndex1]);
	}
	setTalentSelectContainerTalentIndex(talentSelectContainers[0], newTalentIndex1);
	setTalentSelectContainerTalentIndex(talentSelectContainers[1], newTalentIndex2);
	update();
}

function onClickSwap() {
	const talentIndex1 = getTalentSelectContainerTalentIndex(talentSelectContainers[0]);
	const talentIndex2 = getTalentSelectContainerTalentIndex(talentSelectContainers[1]);
	setTalentSelectContainerTalentIndex(talentSelectContainers[0], talentIndex2);
	setTalentSelectContainerTalentIndex(talentSelectContainers[1], talentIndex1);
	update();
}

function initTalentSelectContainers() {
	const talentIndex = getRandomInt(talentIds.length);
	for (let i = 0; i < 2; i++) {
		const talentSelectContainer = $(`.talent-select-container-${i+1}`);
		setTalentSelectContainerTalentIndex(talentSelectContainer, talentIndex);

		talentSelectContainer.querySelector(".talent-select-image").onclick = onClickTalentDropdown;
		talentSelectContainer.querySelector(".talent-select-name").onclick = onClickTalentDropdown;
		talentSelectContainer.querySelector(".icon-up").onclick = onClickTalentPrevious;
		talentSelectContainer.querySelector(".icon-down").onclick = onClickTalentNext;
		talentSelectContainer.querySelector(".icon-random").onclick = onClickTalentRandom;

		talentSelectContainers[i] = talentSelectContainer;
	}
}

function initTalentSelect() {
	createAndInsertTalentSelectContainerElements();
	initTalentSelectContainers();
	initDropdowns();
}

function initResult() {
	const resultContainer = $(".result-box");
	resultContainer.querySelector(".icon-random").onclick = onClickRandomBoth;
	resultContainer.querySelector(".icon-swap").onclick = onClickSwap;
}

function updateTalentSelectContainer(talentSelectContainer) {
	talentSelectContainer.querySelector(".talent-select-name__name").innerHTML
		= getFullNameStringById(
			talentIds[getTalentSelectContainerTalentIndex(talentSelectContainer)]
		);
}

function updateTalentSelectContainers() {
	for (const talentSelectContainer of talentSelectContainers) {
		updateTalentSelectContainer(talentSelectContainer);
	}
}

// function updateResultImage() {

// }

function updateResultName() {
	const [talentId1, talentId2] = getTalentSelectContainerTalentIds();
	let name;
	if (talentId1 === talentId2)
		name = getFullNameStringById(talentId1);
	else
		name = getFusionStringByIds(talentId1, talentId2);
	$(".result-name").innerHTML = name;
}

function updateResult() {
	updateResultName();
	// updateResultImage();
}

function update() {
	updateTalentSelectContainers();
	updateResult();
}

// ------------------------------------------------------------------
// TALENT SELECT DROPDOWN
// ------------------------------------------------------------------

function getDropdownEntry(dropdownElement, talentIndex) {
	return dropdownElement.querySelector(`[data-talent-index="${talentIndex}"]`);
}

function highlightDropdownEntry(dropdownEntry) {
	dropdownEntry.classList.add("talent-dropdown-entries__entry--active");
}

function unhighlightDropdownEntries(dropdownElement) {
	for (const entry of dropdownElement.querySelectorAll(".talent-dropdown-entries__entry")) {
		entry.classList.remove("talent-dropdown-entries__entry--active");
	}
}

function scrollToDropdownEntry(dropdownEntry) {
	dropdownEntry.scrollIntoView({block: "center"});
}

function enableDropdown(talentSelectContainer) {
	for (const selector of dropdownModifierSelectors) {
		talentSelectContainer.querySelector(selector).classList.add("dropdown-enabled");
	}
	const dropdownElement = talentSelectContainer.querySelector(".talent-dropdown");
	const activeEntry = getDropdownEntry(
		dropdownElement,
		getTalentSelectContainerTalentIndex(talentSelectContainer)
	);
	highlightDropdownEntry(activeEntry);
	scrollToDropdownEntry(activeEntry);
}

function disableDropdown(talentSelectContainer) {
	for (const selector of dropdownModifierSelectors) {
		talentSelectContainer.querySelector(selector).classList.remove("dropdown-enabled");
	}
	unhighlightDropdownEntries(talentSelectContainer.querySelector(".talent-dropdown"));
}

function dropdownSortFunctionTalentIndex(dropdownEntry1, dropdownEntry2) {
	const [talentIndex1, talentIndex2] = [dropdownEntry1, dropdownEntry2].map((dropdownEntry) => {
		return parseInt(dropdownEntry.dataset.talentIndex);
	});
	if (talentIndex1 < talentIndex2)
		return -1;
	return 1;
}

function dropdownSortFunctionAlphabet(dropdownEntry1, dropdownEntry2) {
	const [name1, name2] = [dropdownEntry1, dropdownEntry2].map((dropdownEntry) => {
		return dropdownEntry.querySelector(".talent-dropdown-entries__entry__name").innerHTML;
	});
	if (name1 < name2)
		return -1;
	return 1;
}

function sortDropdown(dropdownElement, sortFunction) {
	const entryElements = Array.from(
		dropdownElement.querySelectorAll(".talent-dropdown-entries__entry")
	);
	entryElements.sort(sortFunction);
	for (const entryElement of entryElements) {
		dropdownElement.querySelector(".talent-dropdown-entries").appendChild(entryElement);
	}
}

// eslint-disable-next-line
function sortDropdownByTalentIndex(dropdownElement) {
	sortDropdown(dropdownElement, dropdownSortFunctionTalentIndex);
}

// eslint-disable-next-line
function sortDropdownByAlphabet(dropdownElement) {
	sortDropdown(dropdownElement, dropdownSortFunctionAlphabet);
}

function onClickDropdownEntry(event) {
	const entry = event.currentTarget; // not .target, might have clicked on child element (image, name)
	const talentSelectContainer = getTalentSelectContainerFromChild(entry);
	setTalentSelectContainerTalentIndex(
		talentSelectContainer,
		entry.dataset.talentIndex
	);
	disableDropdown(talentSelectContainer);
	update();
}

function isDropdownEnabled(talentSelectContainer) {
	return talentSelectContainer.querySelector(".talent-dropdown").classList.contains("dropdown-enabled");
}

function onClickTalentDropdown(event) {
	const talentSelectContainer = getTalentSelectContainerFromChild(event.target);
	if (isDropdownEnabled(talentSelectContainer)) return;
	enableDropdown(talentSelectContainer);
	event.dropdownElementIfJustEnabled = talentSelectContainer.querySelector(".talent-dropdown");
}

function addDropdownEntry(dropdownElement, talentIndex, id) {
	const entry = cloneNode($(".template-talent-dropdown-entry"));
	entry.querySelector(".talent-dropdown-entries__entry__image").style.backgroundImage = "url(https://picsum.photos/100)";
	const fullName = getFullNameStringById(id);
	entry.querySelector(".talent-dropdown-entries__entry__name").innerHTML = fullName;
	dropdownElement.querySelector(".talent-dropdown-entries").appendChild(entry);

	/* because entry is of type DocumentFragment things such as setAttribute(),
	   dataset and events can't be used on it */
	const appendedEntry = dropdownElement.querySelector(".talent-dropdown-entries").lastElementChild;
	appendedEntry.dataset.talentIndex = talentIndex;
	appendedEntry.onclick = onClickDropdownEntry;
}

function addEnabledTalentsToDropdown(dropdownElement) {
	for (let i = 0; i < talentIds.length; i++) {
		addDropdownEntry(dropdownElement, i, talentIds[i]);
	}
}

function onClickOutsideDropdown(event, dropdownElement) {
	if (event.dropdownElementIfJustEnabled === dropdownElement) return;
	disableDropdown(getTalentSelectContainerFromChild(dropdownElement));
}

function initDropdowns() {
	for (const talentSelectContainer of talentSelectContainers) {
		const dropdownElement = talentSelectContainer.querySelector(".talent-dropdown");
		addEnabledTalentsToDropdown(dropdownElement);
		document.addEventListener("click", (event) => {
			onClickOutsideDropdown(event, dropdownElement);
		});
	}
}

// ------------------------------------------------------------------
// BACKGROUND
// ------------------------------------------------------------------

function deleteSavedBackgroundIndex() {
	localStorage.removeItem("backgroundIndex");
}

function setBackground(index) {
	backgroundIndex = index;
	$(".background").style.backgroundImage = `url(images/backgrounds/${backgroundImages[index]})`;
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

// ------------------------------------------------------------------
// INFO
// ------------------------------------------------------------------

function showInfo() {
	$(".info").classList.remove("info--out");
	$(".info").classList.add("info--in");
}

function hideInfo() {
	$(".info").classList.remove("info--in");
	$(".info").classList.add("info--out");
}

function initInfo() {
	const classList = $(".info").classList;

	$(".info-button").onclick = (event) => {
		if (classList.contains("info--in")) return;
		showInfo();
		event.stopPropagation();
	};

	window.onkeydown = (event) => {
		if (classList.contains("info--in") && event.key === "Escape") {
			hideInfo();
		}
	};

	window.onclick = () => {
		if (!classList.contains("info--in")) return;
		hideInfo();
	};

	$(".info__close").onclick = () => {
		hideInfo();
	};

	$(".info").onclick = (event) => {
		event.stopPropagation();
	};

	$(".background-forwards").onclick = () => cycleBackgroundForwards();
	$(".background-backwards").onclick = () => cycleBackgroundBackwards();
	$(".background-random").onclick = () => setBackgroundRandomDifferent();
	$(".current-progress").innerHTML = getTalentCountEnabled();
	$(".possible-variations").innerHTML = calculateTalentVariationsEnabled();
}

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------

function main() {
	initTalentSelect();
	initResult();
	update();
	decideBackground();
	initInfo();
}

main();
