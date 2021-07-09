import {getTalentById} from "./talent.js";

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

async function createImageManifest(id1, id2) {
	const talent1Draw = getTalentById(id1).drawFirst;
	const talent2Draw = getTalentById(id2).drawSecond;
	const manifest = {};
	const imageLoadPromises = [];

	const baseImage = createImage(path + id2 + "-base" + ext);
	manifest.baseImage = baseImage;
	addImageToImageLoadPromises(baseImage, imageLoadPromises);

	if (talent1Draw.mouth && talent2Draw.mouth) {
		manifest.mouth = {};

		if (talent1Draw.mouth.hasBlend) {
			const mouthBlendImage = createImage(path + id1 + "-mouth-blend" + ext);
			manifest.mouth.blend = mouthBlendImage;
			addImageToImageLoadPromises(mouthBlendImage, imageLoadPromises);
		}

		if (talent1Draw.mouth.hasCutout) {
			const mouthCutoutImage = createImage(path + id1 + "-mouth-cutout" + ext);
			manifest.mouth.cutout = mouthCutoutImage;
			addImageToImageLoadPromises(mouthCutoutImage, imageLoadPromises);
		}
	}

	if (talent1Draw.nose && talent2Draw.nose) {
		const noseImage = createImage(path + id1 + "-nose" + ext);
		manifest.nose = noseImage;
		addImageToImageLoadPromises(noseImage, imageLoadPromises);
	}

	if (talent1Draw.eyes && talent2Draw.eyes) {
		const sides = talent2Draw.eyes.sides;
		manifest.eyes = {};

		if (!(talent1Draw.eyes.areDifferent && sides === "right")) {
			const eyeImageLeft = createImage(path + id1 + "-eye-left" + ext);
			manifest.eyes.left = eyeImageLeft;
			addImageToImageLoadPromises(eyeImageLeft, imageLoadPromises);
		}

		if (talent1Draw.eyes.areDifferent && (sides === "both" || sides === "right")) {
			const eyeImageRight = createImage(path + id1 + "-eye-right" + ext);
			manifest.eyes.right = eyeImageRight;
			addImageToImageLoadPromises(eyeImageRight, imageLoadPromises);
		}
	}

	for (const paletteType of paletteTypes) {
		if (!talent1Draw[paletteType] || !talent2Draw[paletteType])
			continue;

		manifest[paletteType] = [];
		for (let i = 0; i < talent2Draw[paletteType].count; i++) {
			const image = createImage(path + id2 + "-" + paletteType + "-" + i + ext);
			manifest[paletteType].push(image);
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

function degToRad(angle) {
	return angle * Math.PI / 180;
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

async function drawOriginalTalent(canvas, id) {
	const originalImage = createImage(path + id + "-original" + ext);
	await createImageLoadPromise(originalImage);
	canvas.width = originalImage.width;
	canvas.height = originalImage.height;
	const ctx = canvas.getContext("2d");
	ctx.drawImage(originalImage, 0, 0);
	return canvas;
}

function setRotation(ctx, angle) {
	if (!angle) return;
	ctx.save();
	ctx.rotate(degToRad(angle));
}

function unsetRotation(ctx, angle) {
	if (!angle) return;
	ctx.restore();
}

function drawEyes(ctx, imageManifest, talent1Draw, talent2Draw) {
	assertImagesAreSameSize(Object.values(imageManifest.eyes));
	const baseImage = imageManifest.baseImage;
	const faceCenterX = baseImage.width * talent2Draw.faceCenterX;
	const eyeImage = imageManifest.eyes.left || imageManifest.eyes.right;
	const eyeWidth = eyeImage.width * (talent1Draw.eyes.right - talent1Draw.eyes.left);
	const eyeWidthFace = baseImage.width * talent2Draw.eyes.width;
	const eyeWidthFaceToEyeWidthRatio = eyeWidthFace / eyeWidth;
	const faceCenterXToEyeDistance = baseImage.width * talent2Draw.eyes.faceCenterXToEyeDistance;
	const eyeSize = proportionalScaleWidth(
		eyeWidthFaceToEyeWidthRatio * eyeImage.width,
		eyeImage.width,
		eyeImage.height
	);
	const eyeY = baseImage.height * talent2Draw.eyes.y - eyeSize.height * talent1Draw.eyes.y;
	const sides = talent2Draw.eyes.sides;

	if (sides === "both" || sides === "left") {
		const eyeX = faceCenterX - faceCenterXToEyeDistance - eyeSize.width * talent1Draw.eyes.right;
		ctx.drawImage(eyeImage, eyeX, eyeY, eyeSize.width, eyeSize.height);
	}

	if (sides === "both" || sides === "right") {
		const eyeImage = imageManifest.eyes.right || imageManifest.eyes.left;
		const eyeX = baseImage.width - faceCenterX - faceCenterXToEyeDistance - eyeSize.width * talent1Draw.eyes.right;
		ctx.save();
		ctx.translate(baseImage.width, 0);
		ctx.scale(-1, 1);
		ctx.drawImage(eyeImage, eyeX, eyeY, eyeSize.width, eyeSize.height);
		ctx.restore();
	}
}

async function drawResult(id1, id2) {
	const canvas = document.createElement("canvas");

	if (id1 === id2) {
		return drawOriginalTalent(canvas, id1);
	}

	const ctx = canvas.getContext("2d");
	const imageManifest = await createImageManifest(id1, id2);
	const talent1Draw = getTalentById(id1).drawFirst;
	const talent2Draw = getTalentById(id2).drawSecond;
	const baseImage = imageManifest.baseImage;
	const paletteImages = [];

	for (const paletteType of paletteTypes) {
		if (imageManifest[paletteType]) {
			for (const image of imageManifest[paletteType]) {
				paletteImages.push(image);
			}
		}
	}

	assertImagesAreSameSize(paletteImages.concat([baseImage]));

	canvas.width = baseImage.width;
	canvas.height = baseImage.height;

	const baseImagePaletteAreasBlackAndWhite = createCanvasSameSize(canvas);
	const ctxbw = baseImagePaletteAreasBlackAndWhite.getContext("2d");
	ctxbw.drawImage(baseImage, 0, 0);
	ctxbw.globalCompositeOperation = "saturation";
	ctxbw.fillStyle = "black";
	ctxbw.fillRect(0, 0, baseImagePaletteAreasBlackAndWhite.width, baseImagePaletteAreasBlackAndWhite.height);

	const rawPalettes = createCanvasSameSize(canvas);
	const ctxp = rawPalettes.getContext("2d");
	for (const paletteImage of paletteImages) {
		ctxp.drawImage(paletteImage, 0, 0);
	}

	ctxbw.globalCompositeOperation = "destination-in";
	ctxbw.drawImage(rawPalettes, 0, 0);

	ctx.drawImage(baseImage, 0, 0);
	ctx.drawImage(baseImagePaletteAreasBlackAndWhite, 0, 0);

	const faceCenterX = baseImage.width * talent2Draw.faceCenterX;
	const rotation = talent2Draw.rotation;

	setRotation(ctx, rotation);

	if (imageManifest.mouth) {
		assertImagesAreSameSize(Object.values(imageManifest.mouth));
		const mouthImage = imageManifest.mouth.blend || imageManifest.mouth.cutout;
		const mouthWidth = mouthImage.width * talent1Draw.mouth.width;
		const mouthWidthFace = baseImage.width * talent2Draw.mouth.width;
		const mouthYFace = baseImage.height * talent2Draw.mouth.y;
		const mouthWidthFaceToMouthWidthRatio = mouthWidthFace / mouthWidth;
		const mouthSize = proportionalScaleWidth(
			mouthWidthFaceToMouthWidthRatio * mouthImage.width,
			mouthImage.width,
			mouthImage.height
		);
		const mouthX = faceCenterX - mouthSize.width * talent1Draw.mouth.x;
		const mouthY = mouthYFace - mouthSize.height * talent1Draw.mouth.y;

		if (imageManifest.mouth.blend) {
			ctx.save();
			ctx.globalCompositeOperation = "difference";
			ctx.drawImage(imageManifest.mouth.blend, mouthX, mouthY, mouthSize.width, mouthSize.height);
			ctx.restore();
		}

		if (imageManifest.mouth.cutout) {
			ctx.drawImage(imageManifest.mouth.cutout, mouthX, mouthY, mouthSize.width, mouthSize.height);
		}

		if (imageManifest.nose) {
			const noseImage = imageManifest.nose;
			const noseYFace = baseImage.height * talent2Draw.nose.y;
			const noseSize = proportionalScaleWidth(
				mouthWidthFaceToMouthWidthRatio * noseImage.width,
				noseImage.width,
				noseImage.height
			);
			const noseX = faceCenterX - noseSize.width * talent1Draw.nose.x;
			const noseY = noseYFace - noseSize.height * talent1Draw.nose.y;
			ctx.save();
			ctx.globalCompositeOperation = "difference";
			ctx.drawImage(noseImage, noseX, noseY, noseSize.width, noseSize.height);
			ctx.restore();
		}
	}

	if (imageManifest.eyes && !talent2Draw.areEyesOnTop) {
		drawEyes(ctx, imageManifest, talent1Draw, talent2Draw);
	}

	unsetRotation(ctx, rotation);

	for (const paletteType of paletteTypes) {
		if (!imageManifest[paletteType]) continue;
		for (const [i, paletteImage] of imageManifest[paletteType].entries()) {
			ctx.save();
			const color = talent1Draw[paletteType].colors[i % talent1Draw[paletteType].colors.length];
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

	if (imageManifest.eyes && talent2Draw.areEyesOnTop) {
		drawEyes(ctx, imageManifest, talent1Draw, talent2Draw);
	}

	return canvas;
}

let currentDrawId = 0;

async function drawFusion(canvasDOM, id1, id2) {
	const drawId = ++currentDrawId;
	const ctx = canvasDOM.getContext("2d");
	clearCanvas(ctx);
	const canvasResult = await drawResult(id1, id2);
	if (currentDrawId !== drawId) return;
	drawBg(ctx);
	const {width: w, height: h} = resizeToContain(canvasDOM.width, canvasDOM.height, canvasResult.width, canvasResult.height);
	ctx.drawImage(canvasResult, getAlignPos(canvasDOM.width, w, 0.5), getAlignPos(canvasDOM.height, h, 1), w, h);
}

export {drawFusion};
