import {getTalentById} from "./lib/talent.js";

const path = "images/talents/";
const ext = ".webp";
const paletteTypes = ["hair", "body", "etc"];
const rectPointTypes = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
const unitinuAngle = degToRad(6);

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
	const talent1Draw = getTalentById(id1).draw.first;
	const talent2Draw = getTalentById(id2).draw.second;
	const manifest = {};
	const imageLoadPromises = [];

	const baseImage = createImage(path + id2 + "-base" + ext);
	manifest.baseImage = baseImage;
	addImageToImageLoadPromises(baseImage, imageLoadPromises);

	if (talent1Draw.mouth && talent2Draw.mouth) {
		manifest.mouth = {};

		if (talent1Draw.mouth.hasSub) {
			const mouthBlendSubImage = createImage(path + id1 + "-mouth-blend-sub" + ext);
			manifest.mouth.sub = mouthBlendSubImage;
			addImageToImageLoadPromises(mouthBlendSubImage, imageLoadPromises);
		}

		if (talent1Draw.mouth.hasAdd) {
			const mouthBlendAddImage = createImage(path + id1 + "-mouth-blend-add" + ext);
			manifest.mouth.add = mouthBlendAddImage;
			addImageToImageLoadPromises(mouthBlendAddImage, imageLoadPromises);
		}

		if (talent1Draw.mouth.hasCutout) {
			const mouthCutoutImage = createImage(path + id1 + "-mouth-cutout" + ext);
			manifest.mouth.cutout = mouthCutoutImage;
			addImageToImageLoadPromises(mouthCutoutImage, imageLoadPromises);
		}
	}

	if (talent1Draw.nose && talent2Draw.nose) {
		manifest.nose = {};

		if (talent1Draw.nose.hasSub) {
			const noseSubImage = createImage(path + id1 + "-nose-sub" + ext);
			manifest.nose.sub = noseSubImage;
			addImageToImageLoadPromises(noseSubImage, imageLoadPromises);
		}

		if (talent1Draw.nose.hasAdd) {
			const noseAddImage = createImage(path + id1 + "-nose-add" + ext);
			manifest.nose.add = noseAddImage;
			addImageToImageLoadPromises(noseAddImage, imageLoadPromises);
		}
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
		if (!talent1Draw[paletteType] || !talent2Draw[paletteType]) continue;

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
	return v0 * (1 - t) + v1 * t;
}

function getAspectRatio(width, height) {
	return width / height;
}

function degToRad(angle) {
	return (angle * Math.PI) / 180;
}

// function radToDeg(angle) {
// 	return (angle * 180) / Math.PI;
// }

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
	if (getAspectRatio(width1, height1) > getAspectRatio(width2, height2)) return true;
	return false;
}

function resizeToContain(widthTarget, heightTarget, width, height) {
	if (isAspectRatioGreaterThanOther(width, height, widthTarget, heightTarget))
		return proportionalScaleWidth(widthTarget, width, height);
	return proportionalScaleHeight(heightTarget, width, height);
}

// function resizeToCover(widthTarget, heightTarget, width, height) {
// 	if (isAspectRatioGreaterThanOther(width, height, widthTarget, heightTarget))
// 		return proportionalScaleHeight(heightTarget, width, height);
// 	return proportionalScaleWidth(widthTarget, width, height);
// }

function getAlignPos(lengthTarget, length, t) {
	return lerp(0, lengthTarget - length, t);
}

function clearCanvas(canvas) {
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBg(canvas) {
	const ctx = canvas.getContext("2d");
	ctx.save();
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
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
	const eyeWidth = eyeImage.width * (talent1Draw.eyes.xRight - talent1Draw.eyes.xLeft);
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
		const eyeX =
			faceCenterX - faceCenterXToEyeDistance - eyeSize.width * talent1Draw.eyes.xRight;
		ctx.drawImage(eyeImage, eyeX, eyeY, eyeSize.width, eyeSize.height);
	}

	if (sides === "both" || sides === "right") {
		const eyeImage = imageManifest.eyes.right || imageManifest.eyes.left;
		const eyeX =
			baseImage.width -
			faceCenterX -
			faceCenterXToEyeDistance -
			eyeSize.width * talent1Draw.eyes.xRight;
		ctx.save();
		ctx.translate(baseImage.width, 0);
		ctx.scale(-1, 1);
		ctx.drawImage(eyeImage, eyeX, eyeY, eyeSize.width, eyeSize.height);
		ctx.restore();
	}
}

function cloneCanvas(canvas) {
	const newCanvas = document.createElement("canvas");
	newCanvas.width = canvas.width;
	newCanvas.height = canvas.height;
	const ctx = newCanvas.getContext("2d");
	ctx.drawImage(canvas, 0, 0);
	return newCanvas;
}

function createHorizontalFlip(canvas) {
	const canvasClone = cloneCanvas(canvas);
	const ctx = canvasClone.getContext("2d");
	ctx.translate(canvas.width, 0);
	ctx.scale(-1, 1);
	ctx.drawImage(canvas, 0, 0);
	return canvasClone;
}

function getDistance(x1, y1, x2, y2) {
	return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function getAngle(x1, y1, x2, y2) {
	return Math.atan2(y2 - y1, x2 - x1);
}

function getPoint(x, y, angleRad, distance) {
	const newX = distance * Math.cos(angleRad) + x;
	const newY = distance * Math.sin(angleRad) + y;
	return {x: newX, y: newY};
}

function getBoundingBoxRect(rect) {
	let left = Infinity,
		right = -Infinity,
		top = Infinity,
		bottom = -Infinity;

	for (const point of rectPointTypes) {
		left = Math.min(left, rect[point].x);
		right = Math.max(right, rect[point].x);
		top = Math.min(top, rect[point].y);
		bottom = Math.max(bottom, rect[point].y);
	}

	return {
		left: left,
		right: right,
		top: top,
		bottom: bottom,
		width: right - left,
		height: bottom - top
	};
}

function getRectAngle(rect) {
	return getAngle(rect.topLeft.x, rect.topLeft.y, rect.topRight.x, rect.topRight.y);
}

function translateRect(rect, x, y) {
	for (const rectPointType of rectPointTypes) {
		if (x) rect[rectPointType].x += x;
		if (y) rect[rectPointType].y += y;
	}
}

function getRectFittingIntoHeight(rect, height) {
	const heightRatio = height / getBoundingBoxRect(rect).height;
	const angle = getRectAngle(rect);

	const rectWidth = getDistance(rect.topLeft.x, rect.topLeft.y, rect.topRight.x, rect.topRight.y);
	const rectHeight = getDistance(
		rect.topLeft.x,
		rect.topLeft.y,
		rect.bottomLeft.x,
		rect.bottomLeft.y
	);

	const topLeft = {x: 0, y: 0};
	const topRight = getPoint(topLeft.x, topLeft.y, angle, rectWidth * heightRatio);
	const bottomLeft = getPoint(
		topLeft.x,
		topLeft.y,
		angle + Math.PI / 2,
		rectHeight * heightRatio
	);
	const bottomRight = getPoint(
		topRight.x,
		topRight.y,
		angle + Math.PI / 2,
		rectHeight * heightRatio
	);

	const newRect = {
		topLeft: topLeft,
		topRight: topRight,
		bottomLeft: bottomLeft,
		bottomRight: bottomRight
	};

	translateRect(newRect, 0, -getBoundingBoxRect(newRect).top);

	return newRect;
}

function collisionLineLine(line1, line2) {
	const uA =
		((line2.x2 - line2.x1) * (line1.y1 - line2.y1) -
			(line2.y2 - line2.y1) * (line1.x1 - line2.x1)) /
		((line2.y2 - line2.y1) * (line1.x2 - line1.x1) -
			(line2.x2 - line2.x1) * (line1.y2 - line1.y1));
	const uB =
		((line1.x2 - line1.x1) * (line1.y1 - line2.y1) -
			(line1.y2 - line1.y1) * (line1.x1 - line2.x1)) /
		((line2.y2 - line2.y1) * (line1.x2 - line1.x1) -
			(line2.x2 - line2.x1) * (line1.y2 - line1.y1));

	if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
		return {
			intersectionX: line1.x1 + uA * (line1.x2 - line1.x1),
			intersectionY: line1.y1 + uA * (line1.y2 - line1.y1)
		};
	}

	return null;
}

function collisionLineRect(line, rect) {
	const intersections = [];

	intersections.push(
		collisionLineLine(line, {
			x1: rect.topLeft.x,
			y1: rect.topLeft.y,
			x2: rect.topRight.x,
			y2: rect.topRight.y
		})
	);

	intersections.push(
		collisionLineLine(line, {
			x1: rect.topRight.x,
			y1: rect.topRight.y,
			x2: rect.bottomRight.x,
			y2: rect.bottomRight.y
		})
	);

	intersections.push(
		collisionLineLine(line, {
			x1: rect.bottomRight.x,
			y1: rect.bottomRight.y,
			x2: rect.bottomLeft.x,
			y2: rect.bottomLeft.y
		})
	);

	intersections.push(
		collisionLineLine(line, {
			x1: rect.bottomLeft.x,
			y1: rect.bottomLeft.y,
			x2: rect.topLeft.x,
			y2: rect.topLeft.y
		})
	);

	return intersections.filter((v) => Boolean(v));
}

function getRotatedPoint(point, origin, angle) {
	return getPoint(
		origin.x,
		origin.y,
		getAngle(origin.x, origin.y, point.x, point.y) + angle,
		getDistance(origin.x, origin.y, point.x, point.y)
	);
}

function createHalfFromLeftSide(canvas, chinX, chinY, cutoutAngle) {
	const cutoutWidth = canvas.width / 2;
	const cutoutHeight = canvas.height;

	const topLeft = {x: 0, y: 0};
	const topRight = getPoint(topLeft.x, topLeft.y, cutoutAngle, cutoutWidth);
	const bottomLeft = getPoint(topLeft.x, topLeft.y, cutoutAngle + Math.PI / 2, cutoutHeight);
	const bottomRight = getPoint(topRight.x, topRight.y, cutoutAngle + Math.PI / 2, cutoutHeight);

	const rectCutout = getRectFittingIntoHeight(
		{
			topLeft: topLeft,
			topRight: topRight,
			bottomLeft: bottomLeft,
			bottomRight: bottomRight
		},
		canvas.height
	);

	translateRect(rectCutout, -1000000);

	const intersections = collisionLineRect(
		{x1: chinX, y1: chinY, x2: -1000000, y2: chinY},
		rectCutout
	);
	let horizontalShiftAmount = Infinity;
	for (const intersection of intersections) {
		horizontalShiftAmount = Math.min(
			horizontalShiftAmount,
			getDistance(chinX, chinY, intersection.intersectionX, intersection.intersectionY)
		);
	}

	translateRect(rectCutout, horizontalShiftAmount);

	const canvasPaddedSize = getDistance(0, 0, canvas.width, canvas.height);
	const canvasPadded = document.createElement("canvas");
	canvasPadded.width = canvasPaddedSize;
	canvasPadded.height = canvasPaddedSize;
	const canvasPaddedCtx = canvasPadded.getContext("2d");
	drawBg(canvasPadded);
	canvasPaddedCtx.drawImage(
		canvas,
		(canvasPaddedSize - canvas.width) / 2,
		(canvasPaddedSize - canvas.height) / 2
	);

	const canvasPaddedRotated = document.createElement("canvas");
	canvasPaddedRotated.width = canvasPaddedSize;
	canvasPaddedRotated.height = canvasPaddedSize;
	const canvasPaddedRotatedCtx = canvasPaddedRotated.getContext("2d");
	canvasPaddedRotatedCtx.translate(canvasPaddedSize / 2, canvasPaddedSize / 2);
	canvasPaddedRotatedCtx.rotate(-cutoutAngle);
	canvasPaddedRotatedCtx.translate(-canvas.width / 2, -canvas.height / 2);
	canvasPaddedRotatedCtx.drawImage(canvas, 0, 0);

	translateRect(
		rectCutout,
		(canvasPaddedSize - canvas.width) / 2,
		(canvasPaddedSize - canvas.height) / 2
	);

	const canvasFinal = document.createElement("canvas");
	canvasFinal.width = cutoutWidth;
	canvasFinal.height = cutoutHeight;
	const canvasFinalCtx = canvasFinal.getContext("2d");
	const rectTopLeftFinal = getRotatedPoint(
		{x: rectCutout.topLeft.x, y: rectCutout.topLeft.y},
		{
			x: canvasPaddedRotated.width / 2,
			y: canvasPaddedRotated.height / 2
		},
		-cutoutAngle
	);

	canvasFinalCtx.drawImage(
		canvasPaddedRotated,
		rectTopLeftFinal.x,
		rectTopLeftFinal.y,
		getDistance(
			rectCutout.topLeft.x,
			rectCutout.topLeft.y,
			rectCutout.topRight.x,
			rectCutout.topRight.y
		),
		getDistance(
			rectCutout.topLeft.x,
			rectCutout.topLeft.y,
			rectCutout.bottomLeft.x,
			rectCutout.bottomLeft.y
		),
		0,
		0,
		canvasFinal.width,
		canvasFinal.height
	);

	return canvasFinal;
}

function createHalfFromRightSide(canvas, chinX, chinY, cutoutAngle) {
	return createHalfFromLeftSide(
		createHorizontalFlip(canvas),
		canvas.width - chinX,
		chinY,
		cutoutAngle
	);
}

function createCanvasMirrorToRight(canvas) {
	const newCanvas = document.createElement("canvas");
	newCanvas.width = canvas.width * 2;
	newCanvas.height = canvas.height;
	const ctx = newCanvas.getContext("2d");
	ctx.drawImage(canvas, 0, 0);
	ctx.translate(newCanvas.width, 0);
	ctx.scale(-1, 1);
	ctx.drawImage(canvas, 0, 0);
	return newCanvas;
}

function drawUnitinu(canvas, unitinuType, chinX, chinY, talentRotation) {
	if (unitinuType.side === "none") return;

	let cutoutAngle;
	if (unitinuType.angled === "up") {
		cutoutAngle = unitinuAngle * -1;
	} else if (unitinuType.angled === "down") {
		cutoutAngle = unitinuAngle;
	} else {
		cutoutAngle = 0;
	}

	if (!talentRotation) talentRotation = 0;
	const {x: chinXRotated, y: chinYRotated} = getRotatedPoint(
		{x: chinX, y: chinY},
		{x: 0, y: 0},
		degToRad(talentRotation)
	);

	let createHalfFunction;
	if (unitinuType.side === "left") {
		createHalfFunction = createHalfFromLeftSide;
	} else {
		createHalfFunction = createHalfFromRightSide;
	}

	return createCanvasMirrorToRight(
		createHalfFunction(canvas, chinXRotated, chinYRotated, cutoutAngle)
	);
}

async function drawResult(id1, id2, unitinuType) {
	const canvas = document.createElement("canvas");

	if (id1 === id2) {
		const originalTalentResult = await drawOriginalTalent(canvas, id1);

		if (unitinuType.side !== "none") {
			const drawSecond = getTalentById(id1).draw.second;
			return drawUnitinu(
				originalTalentResult,
				unitinuType,
				originalTalentResult.width * drawSecond.faceCenterX,
				originalTalentResult.height * drawSecond.unitinu.faceChinY,
				drawSecond.rotation
			);
		}

		return originalTalentResult;
	}

	const ctx = canvas.getContext("2d");
	const imageManifest = await createImageManifest(id1, id2);
	const talent1Draw = getTalentById(id1).draw.first;
	const talent2Draw = getTalentById(id2).draw.second;
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
	ctxbw.fillRect(
		0,
		0,
		baseImagePaletteAreasBlackAndWhite.width,
		baseImagePaletteAreasBlackAndWhite.height
	);

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
		const mouthImage =
			imageManifest.mouth.sub || imageManifest.mouth.add || imageManifest.mouth.cutout;
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

		if (imageManifest.mouth.sub) {
			ctx.save();
			ctx.globalCompositeOperation = "difference";
			ctx.drawImage(
				imageManifest.mouth.sub,
				mouthX,
				mouthY,
				mouthSize.width,
				mouthSize.height
			);
			ctx.restore();
		}

		if (imageManifest.mouth.add) {
			ctx.save();
			ctx.globalCompositeOperation = "lighter";
			ctx.drawImage(
				imageManifest.mouth.add,
				mouthX,
				mouthY,
				mouthSize.width,
				mouthSize.height
			);
			ctx.restore();
		}

		if (imageManifest.mouth.cutout) {
			ctx.drawImage(
				imageManifest.mouth.cutout,
				mouthX,
				mouthY,
				mouthSize.width,
				mouthSize.height
			);
		}

		if (imageManifest.nose) {
			assertImagesAreSameSize(Object.values(imageManifest.nose));
			const noseImage = imageManifest.nose.sub || imageManifest.nose.add;
			const noseYFace = baseImage.height * talent2Draw.nose.y;
			const noseSize = proportionalScaleWidth(
				mouthWidthFaceToMouthWidthRatio * noseImage.width,
				noseImage.width,
				noseImage.height
			);
			const noseX = faceCenterX - noseSize.width * talent1Draw.nose.x;
			const noseY = noseYFace - noseSize.height * talent1Draw.nose.y;

			if (imageManifest.nose.add) {
				ctx.save();
				ctx.globalCompositeOperation = "lighter";
				ctx.drawImage(
					imageManifest.nose.add,
					noseX,
					noseY,
					noseSize.width,
					noseSize.height
				);
				ctx.restore();
			}

			if (imageManifest.nose.sub) {
				ctx.save();
				ctx.globalCompositeOperation = "difference";
				ctx.drawImage(
					imageManifest.nose.sub,
					noseX,
					noseY,
					noseSize.width,
					noseSize.height
				);
				ctx.restore();
			}
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
			const color =
				talent1Draw[paletteType].colors[i % talent1Draw[paletteType].colors.length];
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

	if (unitinuType.side !== "none") {
		return drawUnitinu(
			canvas,
			unitinuType,
			faceCenterX,
			baseImage.height * talent2Draw.unitinu.faceChinY,
			rotation
		);
	}

	return canvas;
}

let currentDrawId = 0;

async function drawFusion(canvasDOM, id1, id2, unitinuType) {
	const drawId = ++currentDrawId;
	const ctx = canvasDOM.getContext("2d");
	clearCanvas(canvasDOM);
	const canvasResult = await drawResult(id1, id2, unitinuType);
	if (currentDrawId !== drawId) return;
	drawBg(canvasDOM);
	const {width: w, height: h} = resizeToContain(
		canvasDOM.width,
		canvasDOM.height,
		canvasResult.width,
		canvasResult.height
	);
	ctx.drawImage(
		canvasResult,
		getAlignPos(canvasDOM.width, w, 0.5),
		getAlignPos(canvasDOM.height, h, 1),
		w,
		h
	);
}

export {drawFusion};
