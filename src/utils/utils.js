import generatePlaid from "./plaid";

export function getRandomPair() {
  const pair = [Math.random(), Math.random()];
  return pair.sort();
}

export function sortPairsByDistance(randomPairs) {
  return randomPairs.sort((a, b) => Math.abs(b[0] - b[1]) - Math.abs(a[0] - a[1]));
}

export function getRandomPivots(length) {
  const randomN2 = Array.from({ length }, getRandomPair);
  return sortPairsByDistance(randomN2);
}

// Helper function to get random items from an array
export const getRandomItems = (arr, num) => {
  const result = [];
  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    result.push(arr[randomIndex]);
  }
  return result;
};

// Helper function to convert a 2D array of RGB values to image data
const arrayToImageData = (imageArray) => {
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

// Helper function to convert image data to pattern and fill with color
const imageDataToCanvas = (imageData) => {
  const patternCanvas = document.createElement("canvas");
  patternCanvas.width = imageData.width;
  patternCanvas.height = imageData.height;

  const patternContext = patternCanvas.getContext("2d");
  patternContext.putImageData(imageData, 0, 0);

  return patternCanvas;
};

// Helper function to create canvas with a pattern
export const createSizedCanvas = (patternCanvas, width = 300, height= 300) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  const pattern = ctx.createPattern(patternCanvas, "repeat");
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
};
// Helper function to convert canvas to a data URL
export const canvasToDataURL = (canvas) => {
  return canvas.toDataURL();
};

// Helper function to convert a 3D array of RGB values to a data URL
export const arrayToDataURL = (imageArray) => {
  const imageData = arrayToImageData(imageArray);
  const patternCanvas = imageDataToCanvas(imageData);
  const fullSizePatternCanvas = createSizedCanvas(patternCanvas);
  return canvasToDataURL(fullSizePatternCanvas);
};
// Helper function to convert a 3D array of RGB values to a data URL
export const rgbArrayToPatternCanvas = (rgbArray) => {
  const imageData = arrayToImageData(rgbArray);
  return imageDataToCanvas(imageData);
};

export const generatePlaidImageCanvas = (plaidSettings) => {
  if (!plaidSettings.colors.length || !plaidSettings.pivots.length) {
    return null; // If plaidSettings is not valid, return null
  }
  const plaidArray = generatePlaid(plaidSettings);
  return rgbArrayToPatternCanvas(plaidArray);
}

export const canvasToImgSrc = (plaidImageCanvas, plaidWidth, plaidHeight) => {
  const canvas = createSizedCanvas(plaidImageCanvas, plaidWidth, plaidHeight)
  return canvas.toDataURL();
};

export const generateThumbNailImgSrc = (plaidSetting) => {
  const plaidImageCanvas = generatePlaidImageCanvas(plaidSetting)
  return canvasToImgSrc(plaidImageCanvas, 50, 50)
};



