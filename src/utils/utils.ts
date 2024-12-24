import generatePlaid from "./plaid";
import { PlaidOptions } from "../types/plaid";

export function getRandomPair(): [number, number] {
  const pair: [number, number] = [Math.random(), Math.random()];
  return pair.sort() as [number, number];
}

export function sortPairsByDistance(randomPairs: number[][]): number[][] {
  return randomPairs.sort((a, b) => Math.abs(b[0] - b[1]) - Math.abs(a[0] - a[1]));
}

export function getRandomPivots(length: number): number[][] {
  const randomN2 = Array.from({ length }, getRandomPair);
  return sortPairsByDistance(randomN2);
}

export const getRandomItems = (arr: number[][][], num: number): number[][][] => {
  const result: number[][][] = [];
  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    result.push(arr[randomIndex]);
  }
  return result;
};

const arrayToImageData = (imageArray: number[][][]): ImageData => {
  const imageData = new ImageData(imageArray.length, imageArray[0].length);
  for (let x = 0; x < imageArray.length; x++) {
    for (let y = 0; y < imageArray[x].length; y++) {
      const pixelIndex = (y * imageData.width + x) * 4;
      imageData.data[pixelIndex] = imageArray[x][y][0];
      imageData.data[pixelIndex + 1] = imageArray[x][y][1];
      imageData.data[pixelIndex + 2] = imageArray[x][y][2];
      imageData.data[pixelIndex + 3] = 255;
    }
  }
  return imageData;
};

const imageDataToCanvas = (imageData: ImageData): HTMLCanvasElement => {
  const patternCanvas = document.createElement("canvas");
  patternCanvas.width = imageData.width;
  patternCanvas.height = imageData.height;

  const patternContext = patternCanvas.getContext("2d");
  if (!patternContext) throw new Error("Could not get 2d context");
  
  patternContext.putImageData(imageData, 0, 0);
  return patternCanvas;
};

export const createSizedCanvas = (
  patternCanvas: HTMLCanvasElement, 
  width: number = 300, 
  height: number = 300
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");

  canvas.width = width;
  canvas.height = height;
  const pattern = ctx.createPattern(patternCanvas, "repeat");
  if (!pattern) throw new Error("Could not create pattern");

  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
};

export const canvasToDataURL = (canvas: HTMLCanvasElement): string => {
  return canvas.toDataURL();
};

export const arrayToDataURL = (imageArray: number[][][]): string => {
  const imageData = arrayToImageData(imageArray);
  const patternCanvas = imageDataToCanvas(imageData);
  const fullSizePatternCanvas = createSizedCanvas(patternCanvas);
  return canvasToDataURL(fullSizePatternCanvas);
};

export const rgbArrayToPatternCanvas = (rgbArray: number[][][]): HTMLCanvasElement => {
  const imageData = arrayToImageData(rgbArray);
  return imageDataToCanvas(imageData);
};

export const generatePlaidImageCanvas = (plaidSettings: PlaidOptions): HTMLCanvasElement | null => {
  if (!plaidSettings.colors.length || !plaidSettings.pivots.length) {
    return null;
  }
  const plaidArray = generatePlaid(plaidSettings);
  return rgbArrayToPatternCanvas(plaidArray);
};

export const canvasToImgSrc = (
  plaidImageCanvas: HTMLCanvasElement, 
  plaidWidth: number, 
  plaidHeight: number
): string => {
  const canvas = createSizedCanvas(plaidImageCanvas, plaidWidth, plaidHeight);
  return canvas.toDataURL();
};

export const generateThumbNailImgSrc = (plaidSetting: PlaidOptions): string => {
  const plaidImageCanvas = generatePlaidImageCanvas(plaidSetting);
  if (!plaidImageCanvas) return '';
  return canvasToImgSrc(plaidImageCanvas, 50, 50);
};



