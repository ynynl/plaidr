export function getRandomPivots(length) {
  const randomN2 = Array.from({ length }, () => {
    const pair = [Math.random(), Math.random()];
    return pair.sort();
  });
  return randomN2.sort((a, b) => Math.abs(b[0] - b[1]) - Math.abs(a[0] - a[1]));
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

// Helper function to convert a 3D array of RGB values to a data URL
export const arrayToDataURL = (imageArray) => {
  const patternCanvas = document.createElement("canvas");
  patternCanvas.width = imageArray.length;
  patternCanvas.height = imageArray[0].length;

  const patternContext = patternCanvas.getContext("2d");
  const imageData = patternContext.createImageData(patternCanvas.width, patternCanvas.height);
  for (let x = 0; x < patternCanvas.width; x++) {
    for (let y = 0; y < patternCanvas.height; y++) {
      const pixelIndex = (y * patternCanvas.width + x) * 4;
      imageData.data[pixelIndex] = imageArray[x][y][0];
      imageData.data[pixelIndex + 1] = imageArray[x][y][1];
      imageData.data[pixelIndex + 2] = imageArray[x][y][2];
      imageData.data[pixelIndex + 3] = 255;
    }
  }

  patternContext.putImageData(imageData, 0, 0);

  // return patternCanvas.toDataURL()


  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 600;
  const pattern = ctx.createPattern(patternCanvas, "repeat");
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvas.toDataURL()
};



