import "./style.css";

const elemMain = document.querySelector(".main");
const elemResult = document.querySelector(".result-box");

function createAndInsertTalentSelectElements() {
	const template = document.querySelector(".template-talent-select-box");
	const firstClone = template.content.cloneNode(true);
	const secondClone = template.content.cloneNode(true);
	firstClone.querySelector(".talent-select-box").classList.add("talent-select-box-1");
	secondClone.querySelector(".talent-select-box").classList.add("talent-select-box-2");
	elemMain.insertBefore(firstClone, elemResult);
	elemMain.appendChild(secondClone);
}

createAndInsertTalentSelectElements();
