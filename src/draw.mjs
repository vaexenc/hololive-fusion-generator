import {getTalentById} from "./talent.js";
import {mod} from "./util.js";

const path = "images/talents/";
const ext = ".webp";

const paletteTypes = ["hair", "body", "etc"];

function createImage(url) {
	const image = new Image();
	image.src = url;
	return image;
}

function createImageLoadPromise(image) {
	return new Promise((resolve) => {
		image.onload = () => resolve(image);
	});
}

function addImageToImageLoadPromises(image, imageLoadPromises) {
	imageLoadPromises.push(createImageLoadPromise(image));
}

async function createManifest(id1, id2) {
	const talent1 = getTalentById(id1);
	const talent2 = getTalentById(id2);
	const manifest = {};
	const imageLoadPromises = [];

	const baseImage = createImage(path + id2 + "-base" + ext);
	manifest.baseImage = baseImage;
	addImageToImageLoadPromises(baseImage, imageLoadPromises);

	manifest.faceCenterX = talent2.drawSecond.faceCenterX;

	const mouthImage = createImage(path + id1 + "-mouth" + ext);
	manifest.mouth = {
		image: mouthImage,
		x: talent1.drawFirst.mouth.x,
		y: talent1.drawFirst.mouth.y,
		width: talent1.drawFirst.mouth.width,
		yFace: talent2.drawSecond.mouth.y,
		widthFace: talent2.drawSecond.mouth.width
	};

	addImageToImageLoadPromises(mouthImage, imageLoadPromises);

	const noseImage = createImage(path + id1 + "-nose" + ext);
	manifest.nose = {
		image: noseImage,
		x: talent1.drawFirst.nose.x,
		y: talent1.drawFirst.nose.y,
		yFace: talent2.drawSecond.nose.y
	};
	addImageToImageLoadPromises(noseImage, imageLoadPromises);

	for (const paletteType of paletteTypes) {
		if (!talent2.drawSecond[paletteType])
			continue;

		manifest[paletteType] = {};

		manifest[paletteType].colors = talent1.drawFirst[paletteType].colors;

		manifest[paletteType].images = [];
		for (let i = 0; i < talent2.drawSecond[paletteType].count; i++) {
			const image = createImage(path + id2 + "-" + paletteType + "-" + i + ext);
			manifest[paletteType].images.push(image);
			addImageToImageLoadPromises(image, imageLoadPromises);
		}
	}

	await Promise.all(imageLoadPromises);
	return manifest;
}

function assertImagesAreSameSize(images) {
	if (images.length <= 1) return;
	const {width, height} = images[0];
	for (const image of images) {
		if (image.width !== width || image.height !== height)
			throw new Error("images are of different sizes");
	}
}

function lerp(v0, v1, t) {
	return v0 * (1-t) + v1 * t;
}

function getAspectRatio(width, height) {
	return width / height;
}

function proportionalScaleWidth(widthNew, widthOld, heightOld) {
	const factor = widthNew / widthOld;
	return {
		width: widthNew,
		height: heightOld * factor
	};
}

function proportionalScaleHeight(heightNew, widthOld, heightOld) {
	const factor = heightNew / heightOld;
	return {
		width: widthOld * factor,
		height: heightNew
	};
}

function isAspectRatioGreaterThanOther(width1, height1, width2, height2) {
	if (getAspectRatio(width1, height1) > getAspectRatio(width2, height2))
		return true;
	return false;
}

function resizeToContain(widthTarget, heightTarget, width, height) {
	if (isAspectRatioGreaterThanOther(width, height, widthTarget, heightTarget))
		return proportionalScaleWidth(widthTarget, width, height);
	return proportionalScaleHeight(heightTarget, width, height);
}

// eslint-disable-next-line no-unused-vars
function resizeToCover(widthTarget, heightTarget, width, height) {
	if (isAspectRatioGreaterThanOther(width, height, widthTarget, heightTarget))
		return proportionalScaleHeight(heightTarget, width, height);
	return proportionalScaleWidth(widthTarget, width, height);
}

function getAlignPos(lengthTarget, length, t) {
	return lerp(0, lengthTarget - length, t);
}

function clearCanvas(ctx) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawBg(ctx) {
	ctx.save();
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.restore();
}

// eslint-disable-next-line no-unused-vars
function drawDebugNames(ctx, id1, id2) {
	ctx.save();
	ctx.fillStyle = "black";
	ctx.font = `${Math.min(ctx.canvas.width*0.08, ctx.canvas.height*0.08)}px Arial`;
	ctx.textAlign = "left";
	ctx.fillText(id1 + " " + id2, ctx.canvas.width*0.03, ctx.canvas.height*0.09);
	ctx.restore();
}

function createCanvasSameSize(canvas) {
	const newCanvas = document.createElement("canvas");
	newCanvas.width = canvas.width;
	newCanvas.height = canvas.height;
	return newCanvas;
}

async function drawResultCanvas(id1, id2) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (id1 === id2) {
		const originalImage = createImage(path + id1 + "-original" + ext);
		await createImageLoadPromise(originalImage);
		canvas.width = originalImage.width;
		canvas.height = originalImage.height;
		ctx.drawImage(originalImage, 0, 0);
		return canvas;
	}

	const manifest = await createManifest(id1, id2);

	const paletteImages = [];
	for (const paletteType of paletteTypes) {
		if (manifest[paletteType]) {
			for (const image of manifest[paletteType].images) {
				paletteImages.push(image);
			}
		}
	}

	assertImagesAreSameSize(paletteImages.concat([manifest.baseImage]));

	canvas.width = manifest.baseImage.width;
	canvas.height = manifest.baseImage.height;

	const baseImageBlackAndWhite = createCanvasSameSize(canvas);
	const ctxbw = baseImageBlackAndWhite.getContext("2d");
	ctxbw.drawImage(manifest.baseImage, 0, 0);
	ctxbw.globalCompositeOperation = "saturation";
	ctxbw.fillStyle = "black";
	ctxbw.fillRect(0, 0, baseImageBlackAndWhite.width, baseImageBlackAndWhite.height);

	const rawPalettes = createCanvasSameSize(canvas);
	const ctxp = rawPalettes.getContext("2d");
	for (const paletteImage of paletteImages) {
		ctxp.drawImage(paletteImage, 0, 0);
	}

	ctxbw.globalCompositeOperation = "destination-in";
	ctxbw.drawImage(rawPalettes, 0, 0);

	ctx.drawImage(manifest.baseImage, 0, 0);
	ctx.drawImage(baseImageBlackAndWhite, 0, 0);

	const faceCenterX = manifest.baseImage.width * manifest.faceCenterX;

	const mouthImage = manifest.mouth.image;
	const mouthWidth = mouthImage.width * manifest.mouth.width;
	const mouthWidthFace = manifest.baseImage.width * manifest.mouth.widthFace;
	const mouthYFace = manifest.mouth.yFace * manifest.baseImage.height;
	const mouthWidthFaceToMouthWidthRatio = mouthWidthFace / mouthWidth;
	const mouthSize = proportionalScaleWidth(
		mouthWidthFaceToMouthWidthRatio * mouthImage.width,
		mouthImage.width,
		mouthImage.height
	);
	const mouthX = faceCenterX - mouthSize.width * manifest.mouth.x;
	const mouthY = mouthYFace - mouthSize.height * manifest.mouth.y;
	ctx.save();
	ctx.globalCompositeOperation = "difference";
	ctx.drawImage(mouthImage, mouthX, mouthY, mouthSize.width, mouthSize.height);
	ctx.restore();

	const noseImage = manifest.nose.image;
	const noseYFace = manifest.nose.yFace * manifest.baseImage.height;
	const noseSize = proportionalScaleWidth(
		mouthWidthFaceToMouthWidthRatio * noseImage.width,
		noseImage.width,
		noseImage.height
	);
	const noseX = faceCenterX - noseSize.width * manifest.nose.x;
	const noseY = noseYFace - noseSize.height * manifest.nose.y;
	ctx.save();
	ctx.globalCompositeOperation = "difference";
	ctx.drawImage(noseImage, noseX, noseY, noseSize.width, noseSize.height);
	ctx.restore();

	for (const paletteType of paletteTypes) {
		if (!manifest[paletteType]) continue;
		for (const [i, paletteImage] of manifest[paletteType].images.entries()) {
			ctx.save();
			const color = manifest[paletteType].colors[mod(i, manifest[paletteType].colors.length)];
			const paletteLayer = createCanvasSameSize(canvas);
			const ctxl = paletteLayer.getContext("2d");
			ctxl.drawImage(paletteImage, 0, 0);
			ctxl.fillStyle = color;
			ctxl.globalCompositeOperation = "overlay";
			ctxl.fillRect(0, 0, paletteLayer.width, paletteLayer.height);
			ctxl.globalCompositeOperation = "destination-in";
			ctxl.drawImage(paletteImage, 0, 0);
			ctx.drawImage(paletteLayer, 0, 0);
			ctx.restore();
		}
	}

	return canvas;
}

let currentDrawId = 0;

async function drawFusion(canvasDOM, id1, id2) {
	const drawId = ++currentDrawId;
	const ctx = canvasDOM.getContext("2d");
	clearCanvas(ctx);
	const canvasResult = await drawResultCanvas(id1, id2);
	if (currentDrawId !== drawId) return;
	drawBg(ctx);
	const {width: w, height: h} = resizeToContain(canvasDOM.width, canvasDOM.height, canvasResult.width, canvasResult.height);
	ctx.drawImage(canvasResult, getAlignPos(canvasDOM.width, w, 0.5), getAlignPos(canvasDOM.height, h, 1), w, h);
}

export {drawFusion};
