import "../style.css";
import {$, cloneTemplateContent, resetCSSAnimation} from "./browser-util.js";
import {getRandomInt, getRandomIntUnique, mod} from "./lib/util.js";
import {getFullNameStringById, getFusionStringByIds} from "./lib/name.js";
import {getTalentIdsEnabled} from "./lib/talent.js";
import {drawFusion} from "./draw.js";
import {decideBackground} from "./background.js";
import {initInfo} from "./info.js";
import "no-darkreader";

// ------------------------------------------------------------------
// TALENT SELECT, TALENT RESULT
// ------------------------------------------------------------------

const unitinuTypes = [
	{
		side: "none",
		angled: "none"
	},
	{
		side: "left",
		angled: "none"
	},
	{
		side: "left",
		angled: "up"
	},
	{
		side: "left",
		angled: "down"
	},
	{
		side: "right",
		angled: "none"
	},
	{
		side: "right",
		angled: "up"
	},
	{
		side: "right",
		angled: "down"
	}
];
const talentIds = getTalentIdsEnabled();
const talentSelectContainers = [];

let unitinuTypesIndex = 0;

function keepTalentIndexWithinBounds(talentIndex) {
	return mod(talentIndex, talentIds.length);
}

function createAndInsertTalentSelectContainerElements() {
	const template = $(".template-talent-select");
	for (let i = 1; i <= 2; i++) {
		const clone = cloneTemplateContent(template);
		clone
			.querySelector(".talent-select-container")
			.classList.add(`talent-select-container-${i}`);
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
	if (talentSelectContainer === talentSelectContainers[0]) return talentSelectContainers[1];
	return talentSelectContainers[0];
}

function getTalentSelectContainerFromChild(element) {
	return element.closest(".talent-select-container");
}

function talentPrevious(talentSelectContainer) {
	setTalentSelectContainerTalentIndex(
		talentSelectContainer,
		keepTalentIndexWithinBounds(getTalentSelectContainerTalentIndex(talentSelectContainer) - 1)
	);
	update();
}

function talentNext(talentSelectContainer) {
	setTalentSelectContainerTalentIndex(
		talentSelectContainer,
		keepTalentIndexWithinBounds(getTalentSelectContainerTalentIndex(talentSelectContainer) + 1)
	);
	update();
}

function onClickTalentPrevious(event) {
	talentPrevious(getTalentSelectContainerFromChild(event.target));
}

function onClickTalentNext(event) {
	talentNext(getTalentSelectContainerFromChild(event.target));
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

function removeUnitinuClasses(element) {
	for (const className of [...element.classList]) {
		if (className.startsWith("unitinu-")) {
			element.classList.remove(className);
		}
	}
}

function addUnitinuClasses(element, unitinuType) {
	element.classList.add("unitinu-side-" + unitinuType.side);
	element.classList.add("unitinu-angled-" + unitinuType.angled);
}

function updateUnitinuClasses(element, unitinuType) {
	removeUnitinuClasses(element);
	addUnitinuClasses(element, unitinuType);
}

function onClickUnitinu() {
	unitinuTypesIndex = (unitinuTypesIndex + 1) % unitinuTypes.length;
	updateUnitinuClasses($(".button-img-unitinu-container"), unitinuTypes[unitinuTypesIndex]);
	updateUnitinuClasses($(".result-name-container"), unitinuTypes[unitinuTypesIndex]);
	update();
}

function initTalentSelectContainers() {
	const talentIndex = getRandomInt(talentIds.length);
	for (let i = 0; i < 2; i++) {
		const talentSelectContainer = $(`.talent-select-container-${i + 1}`);
		setTalentSelectContainerTalentIndex(talentSelectContainer, talentIndex);

		talentSelectContainer.querySelector(".talent-select-image").onclick = onClickTalentDropdown;
		talentSelectContainer.querySelector(".talent-select-name__name").onclick =
			onClickTalentDropdown;
		talentSelectContainer.querySelector(".button-img-up").onclick = onClickTalentPrevious;
		talentSelectContainer.querySelector(".button-img-down").onclick = onClickTalentNext;
		talentSelectContainer.querySelector(".button-img-random").onclick = onClickTalentRandom;

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
	resultContainer.querySelector(".button-img-random").onclick = onClickRandomBoth;
	resultContainer.querySelector(".button-img-swap").onclick = onClickSwap;

	const unitinuButtonContainer = resultContainer.querySelector(".button-img-unitinu-container");
	unitinuButtonContainer.onclick = onClickUnitinu;
	updateUnitinuClasses(unitinuButtonContainer, unitinuTypes[unitinuTypesIndex]);
}

function updateTalentSelectImage(talentSelectContainer) {
	const talentId = talentIds[getTalentSelectContainerTalentIndex(talentSelectContainer)];
	talentSelectContainer
		.querySelector(".talent-select-image")
		.style.setProperty("--image-url", `url(images/talents/${talentId}-medium.webp)`);
}

function updateTalentSelectName(talentSelectContainer) {
	talentSelectContainer.querySelector(".talent-select-name__name").innerHTML =
		getFullNameStringById(
			talentIds[getTalentSelectContainerTalentIndex(talentSelectContainer)]
		);
}

function updateTalentSelectContainer(talentSelectContainer) {
	updateTalentSelectImage(talentSelectContainer);
	updateTalentSelectName(talentSelectContainer);
	updateTalentSelectDropdown(talentSelectContainer);
}

function updateTalentSelectContainers() {
	for (const talentSelectContainer of talentSelectContainers) {
		updateTalentSelectContainer(talentSelectContainer);
	}
}

function updateResultImage() {
	const resultCanvas = $(".result-canvas");
	resetCSSAnimation(resultCanvas);
	drawFusion(
		resultCanvas,
		...getTalentSelectContainerTalentIds(),
		unitinuTypes[unitinuTypesIndex]
	);
}

function updateResultName() {
	const [talentId1, talentId2] = getTalentSelectContainerTalentIds();
	const fusionString = getFusionStringByIds(talentId1, talentId2);
	$(".result-name").innerHTML = fusionString;
	$(".result-name-copy").innerHTML = fusionString;
}

function updateResult() {
	updateResultName();
	updateResultImage();
}

function update() {
	updateTalentSelectContainers();
	updateResult();
}

// ------------------------------------------------------------------
// TALENT SELECT DROPDOWN
// ------------------------------------------------------------------

const dropdownModifierSelectors = [
	".talent-dropdown",
	".talent-select-button-imgs",
	".talent-select-name",
	".talent-select-image"
];

function getDropdownEntry(dropdownElement, talentIndex) {
	return dropdownElement.querySelector(`[data-talent-index="${talentIndex}"]`);
}

function highlightDropdownEntry(dropdownEntry) {
	dropdownEntry.classList.add("talent-dropdown-entries__entry--highlighted");
}

function unhighlightDropdownEntries(dropdownElement) {
	for (const entry of dropdownElement.querySelectorAll(".talent-dropdown-entries__entry")) {
		entry.classList.remove("talent-dropdown-entries__entry--highlighted");
	}
}

function scrollToDropdownEntry(dropdownEntry) {
	const dropdownEntriesContainer = dropdownEntry.closest(".talent-dropdown-entries");
	const position =
		dropdownEntry.offsetTop -
		dropdownEntriesContainer.offsetHeight / 2 +
		dropdownEntry.offsetHeight / 2;
	dropdownEntriesContainer.scrollTop = position;
}

function addDropdownModifierToElements(talentSelectContainer) {
	for (const selector of dropdownModifierSelectors) {
		talentSelectContainer.querySelector(selector).classList.add("dropdown-visible");
	}
}

function getDropdownEntryOfCurrentlySelectedTalent(dropdownElement) {
	return getDropdownEntry(
		dropdownElement,
		getTalentSelectContainerTalentIndex(getTalentSelectContainerFromChild(dropdownElement))
	);
}

function showDropdown(talentSelectContainer) {
	addDropdownModifierToElements(talentSelectContainer);
	scrollToDropdownEntry(
		getDropdownEntryOfCurrentlySelectedTalent(
			talentSelectContainer.querySelector(".talent-dropdown")
		)
	);
}

function removeDropdownModifierFromElements(talentSelectContainer) {
	for (const selector of dropdownModifierSelectors) {
		talentSelectContainer.querySelector(selector).classList.remove("dropdown-visible");
	}
}

function hideDropdown(talentSelectContainer) {
	removeDropdownModifierFromElements(talentSelectContainer);
}

// function dropdownSortFunctionTalentIndex(dropdownEntry1, dropdownEntry2) {
// 	const [talentIndex1, talentIndex2] = [dropdownEntry1, dropdownEntry2].map((dropdownEntry) => {
// 		return parseInt(dropdownEntry.dataset.talentIndex);
// 	});
// 	if (talentIndex1 < talentIndex2) return -1;
// 	return 1;
// }

// function dropdownSortFunctionAlphabet(dropdownEntry1, dropdownEntry2) {
// 	const [name1, name2] = [dropdownEntry1, dropdownEntry2].map((dropdownEntry) => {
// 		return dropdownEntry.querySelector(".talent-dropdown-entries__entry__name").innerHTML;
// 	});
// 	if (name1 < name2) return -1;
// 	return 1;
// }

// function sortDropdown(dropdownElement, sortFunction) {
// 	const entryElements = Array.from(
// 		dropdownElement.querySelectorAll(".talent-dropdown-entries__entry")
// 	);
// 	entryElements.sort(sortFunction);
// 	for (const entryElement of entryElements) {
// 		dropdownElement.querySelector(".talent-dropdown-entries").appendChild(entryElement);
// 	}
// }

// function sortDropdownByTalentIndex(dropdownElement) {
// 	sortDropdown(dropdownElement, dropdownSortFunctionTalentIndex);
// }

// function sortDropdownByAlphabet(dropdownElement) {
// 	sortDropdown(dropdownElement, dropdownSortFunctionAlphabet);
// }

function onClickDropdownEntry(event) {
	if (event.button !== 0) return;
	const entry = event.currentTarget; // not .target, might have clicked on child element (image, name)
	const talentSelectContainer = getTalentSelectContainerFromChild(entry);
	setTalentSelectContainerTalentIndex(talentSelectContainer, entry.dataset.talentIndex);
	hideDropdown(talentSelectContainer);
	update();
}

function isDropdownVisible(talentSelectContainer) {
	return talentSelectContainer
		.querySelector(".talent-dropdown")
		.classList.contains("dropdown-visible");
}

function onClickTalentDropdown(event) {
	const talentSelectContainer = getTalentSelectContainerFromChild(event.target);
	if (isDropdownVisible(talentSelectContainer)) return;
	showDropdown(talentSelectContainer);
	event.ifDropdownElementJustShown = talentSelectContainer.querySelector(".talent-dropdown");
}

function addDropdownEntry(dropdownElement, talentIndex, id) {
	const entry = cloneTemplateContent($(".template-talent-dropdown-entry"));
	entry
		.querySelector(".talent-dropdown-entries__entry__image")
		.style.setProperty("--image-url", `url(images/talents/${id}-small.webp)`);
	const fullName = getFullNameStringById(id);
	entry.querySelector(".talent-dropdown-entries__entry__name").innerHTML = fullName;
	dropdownElement.querySelector(".talent-dropdown-entries").appendChild(entry);

	/* because entry is of type DocumentFragment things such as setAttribute(),
	   dataset and events can't be used on it */
	const appendedEntry = dropdownElement.querySelector(
		".talent-dropdown-entries"
	).lastElementChild;
	appendedEntry.dataset.talentIndex = talentIndex;
	appendedEntry.onclick = onClickDropdownEntry;
	appendedEntry.onmouseup = onClickDropdownEntry;
}

function addEnabledTalentsToDropdown(dropdownElement) {
	for (let i = 0; i < talentIds.length; i++) {
		addDropdownEntry(dropdownElement, i, talentIds[i]);
	}
}

function onClickOutsideDropdown(event, dropdownElement) {
	if (event.ifDropdownElementJustShown === dropdownElement) return;
	hideDropdown(getTalentSelectContainerFromChild(dropdownElement));
}

function onKeydownDropdown(event, dropdownElement) {
	const talentSelectContainer = getTalentSelectContainerFromChild(dropdownElement);
	if (!isDropdownVisible(talentSelectContainer)) return;

	const keyFunctions = {
		ArrowUp: () => {
			talentPrevious(talentSelectContainer);
		},

		ArrowDown: () => {
			talentNext(talentSelectContainer);
		},

		Enter: () => {
			hideDropdown(talentSelectContainer);
		},

		Escape: () => {
			hideDropdown(talentSelectContainer);
		}
	};

	if (keyFunctions[event.key]) {
		keyFunctions[event.key]();
		event.preventDefault();
	}
}

function initDropdowns() {
	for (const talentSelectContainer of talentSelectContainers) {
		const dropdownElement = talentSelectContainer.querySelector(".talent-dropdown");
		addEnabledTalentsToDropdown(dropdownElement);
		document.addEventListener("click", (event) => {
			onClickOutsideDropdown(event, dropdownElement);
		});
		document.addEventListener("keydown", (event) => {
			onKeydownDropdown(event, dropdownElement);
		});
	}
}

function updateTalentSelectDropdown(talentSelectContainer) {
	unhighlightDropdownEntries(talentSelectContainer.querySelector(".talent-dropdown"));
	const entryOfCurrentTalent = getDropdownEntryOfCurrentlySelectedTalent(talentSelectContainer);
	highlightDropdownEntry(entryOfCurrentTalent);
	scrollToDropdownEntry(entryOfCurrentTalent);
}

// ------------------------------------------------------------------
// MAIN
// ------------------------------------------------------------------

function main() {
	initTalentSelect();
	initResult();
	decideBackground();
	initInfo();
	onClickRandomBoth();
}

main();
