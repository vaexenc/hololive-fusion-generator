const canvasDOM = document.getElementById("main-canvas");
const domctx = canvasDOM.getContext("2d");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");


const img1 = document.createElement("img");
img1.src = "assets/images/ina_base.png";

const img2 = document.createElement("img");
img2.src = "assets/images/ina_eye.png";

let counter = 0;

function brap() {
	counter++;
	if (counter < 2) return;
	ctx.save();
	canvas.width = img1.naturalWidth;
	canvas.height = img1.naturalHeight;
	ctx.drawImage(img1, 0, 0);
	ctx.drawImage(img2, 370, 560);
	ctx.scale(-1, 1);
	// ctx.translate(canvas.width, 0);
	ctx.drawImage(img2, -590, 560, -img2.naturalWidth, img2.naturalHeight);
	domctx.drawImage(canvas, 0, 0, canvasDOM.width, canvasDOM.height);
	ctx.restore();
}

img1.onload = brap;
img2.onload = brap;

console.log("yep");
