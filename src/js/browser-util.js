const $ = document.querySelector.bind(document);

function cloneNode(template) {
	return template.content.cloneNode(true);
}

function resetCSSAnimation(element) {
	element.style.animation = "none";
	element.offsetHeight; // trigger reflow
	element.style.animation = null;
}

export {
	$,
	cloneNode,
	resetCSSAnimation
};
