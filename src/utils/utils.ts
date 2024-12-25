import generatePlaid from "./plaid";
import { PlaidOptions } from "../types/plaid";
import heic2any from 'heic2any';

export function getRandomPair(): [number, number] {
  const pair: [number, number] = [Math.random(), Math.random()];
  return pair.sort() as [number, number];
}

export function sortPairsByDistance(randomPairs: number[][]): number[][] {
  return randomPairs.sort(
    (a, b) => Math.abs(b[0] - b[1]) - Math.abs(a[0] - a[1])
  );
}

export function getRandomPivots(length: number): number[][] {
  const randomN2 = Array.from({ length }, getRandomPair);
  return sortPairsByDistance(randomN2);
}

export const getRandomItems = (arr: number[][], num: number): number[][] => {
  const result: number[][] = [];
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

export const rgbArrayToPatternCanvas = (
  rgbArray: number[][][]
): HTMLCanvasElement => {
  const imageData = arrayToImageData(rgbArray);
  return imageDataToCanvas(imageData);
};

export const generatePlaidImageCanvas = (
  plaidSettings: PlaidOptions
): HTMLCanvasElement | null => {
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
  if (!plaidImageCanvas) return "";
  return canvasToImgSrc(plaidImageCanvas, 50, 50);
};

export const processImage = async (file: File): Promise<number[][]> => {
  let imageBlob = file;
  
  // Convert HEIC to JPEG if needed
  if (file.type === 'image/heic') {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
      });
      imageBlob = new File([convertedBlob as Blob], file.name, { type: 'image/jpeg' });
    } catch (error) {
      console.error('Error converting HEIC:', error);
      throw error;
    }
  }

  // Process image to RGB array with resizing
  const img = await createImageBitmap(imageBlob);
  const canvas = document.createElement("canvas");
  
  // Resize large images to prevent memory issues
  const MAX_SIZE = 800;
  let width = img.width;
  let height = img.height;
  
  if (width > MAX_SIZE || height > MAX_SIZE) {
    if (width > height) {
      height = Math.round((height * MAX_SIZE) / width);
      width = MAX_SIZE;
    } else {
      width = Math.round((width * MAX_SIZE) / height);
      height = MAX_SIZE;
    }
  }
  
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  
  // Use better quality scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);
  
  const imageData = ctx.getImageData(0, 0, width, height);
  
  // Sample pixels instead of processing every pixel
  const SAMPLE_RATE = 4; // Process every 4th pixel
  const rgbArray: number[][] = [];
  
  for (let i = 0; i < imageData.data.length; i += 4 * SAMPLE_RATE) {
    rgbArray.push([
      imageData.data[i],
      imageData.data[i + 1],
      imageData.data[i + 2]
    ]);
  }
  
  return rgbArray;
};
