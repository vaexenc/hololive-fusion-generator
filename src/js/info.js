import {$} from "./browser-util.js";
import {cycleBackgroundForwards, cycleBackgroundBackwards, setBackgroundRandomDifferent} from "./background.js";
import {calculateTalentVariationsEnabled, getTalentCountEnabled} from "./lib/talent.js";

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

export {
	initInfo
};
