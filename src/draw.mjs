function drawFusion(canvas, id1, id2) {
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	ctx.font = `${Math.min(canvas.width*0.08, canvas.height*0.08)}px Arial`;
	ctx.textAlign = "center";
	ctx.fillText(id1 + " " + id2, canvas.width/2, canvas.height/2);
}

export {drawFusion};
