import { PlaidOptions, TwillPattern, NDArray } from "../types/plaid";
const ndarray = require("ndarray");
const tile = require("ndarray-tile");
const pack = require("ndarray-pack");
const unpack = require("ndarray-unpack");
const concatRows = require("ndarray-concat-rows");

function generatePlaid({
  colors,
  size,
  twill,
  pivots,
}: PlaidOptions): number[][][] {
  if (size % 4 !== 0) {
    throw new Error("Invalid size input. Please input a multiple of 4");
  }

  if (colors.length !== pivots.length + 1) {
    throw new Error(
      "Invalid input. Please provide pivot for each color except the last one."
    );
  }

  const sett = createSett(size, colors, pivots);
  const wrap = createWrap(size, sett);
  const rotatedWrap = rotateWrap(size, wrap);
  const pattern = createPattern(twill);
  const mask = createMask(size, pattern);
  const quarterPlaid = applyTwill(size, rotatedWrap, mask, wrap);
  const unpackedPlaid = unpack(quarterPlaid);

  return unpackedPlaid;
}

function createSett(
  size: number,
  colors: number[][],
  pivots: number[][]
): NDArray {
  // Create initial sett
  const halfSize = size / 2;
  const sett: NDArray = ndarray(new Float64Array(halfSize * 3), [halfSize, 3]);
  const background = colors[colors.length - 1];

  // Set background color for half size
  for (let i = 0; i < halfSize; ++i) {
    sett.set(i, 0, background[0]);
    sett.set(i, 1, background[1]);
    sett.set(i, 2, background[2]);
  }

  // Set thread colors for half size
  const threads = createThreads(halfSize, pivots);
  const numOfBand = colors.length - 1;

  for (let colorIndex = 0; colorIndex < numOfBand; ++colorIndex) {
    for (let j = threads[colorIndex][0]; j < threads[colorIndex][1]; ++j) {
      sett.set(j, 0, colors[colorIndex][0]);
      sett.set(j, 1, colors[colorIndex][1]);
      sett.set(j, 2, colors[colorIndex][2]);
    }
  }

  // Create reversed version
  const reversedSett = ndarray(new Float64Array(halfSize * 3), [halfSize, 3]);
  for (let i = 0; i < halfSize; i++) {
    reversedSett.set(i, 0, sett.get(halfSize - 1 - i, 0));
    reversedSett.set(i, 1, sett.get(halfSize - 1 - i, 1));
    reversedSett.set(i, 2, sett.get(halfSize - 1 - i, 2));
  }

  // Concatenate original and reversed
  const fullSett = concatRows([sett, reversedSett]);
  return fullSett;
}

function createThreads(size: number, pivots: number[][]): number[][] {
  const threads = pivots.map((pivot) => [
    Math.floor(pivot[0] * size),
    Math.floor(pivot[1] * size),
  ]);

  return threads;
}

function createWrap(size: number, sett: NDArray): NDArray {
  // Create wrap
  const tiledWrap = tile(sett, [size, 1, 1]);
  const wrap = ndarray(tiledWrap.data, [size, size, 3]);

  return wrap;
}

function rotateWrap(size: number, wrap: NDArray): NDArray {
  // Rotate wrap
  const rotatedWrap = ndarray(new Float64Array(size * size * 3), [
    size,
    size,
    3,
  ]);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      rotatedWrap.set(i, j, 0, wrap.get(size - j - 1, i, 0));
      rotatedWrap.set(i, j, 1, wrap.get(size - j - 1, i, 1));
      rotatedWrap.set(i, j, 2, wrap.get(size - j - 1, i, 2));
    }
  }

  return rotatedWrap;
}

function createPattern(twill: string): TwillPattern {
  const twillMap: Record<string, TwillPattern> = {
    tartan: [
      [1, 0, 0, 1],
      [0, 0, 1, 1],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
    ],
    madras: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, 1],
    ],
    net: [
      [0, 1, 0, 1],
      [1, 0, 1, 0],
      [1, 0, 1, 0],
      [0, 1, 0, 1],
    ],
  };

  if (!twillMap.hasOwnProperty(twill)) {
    throw new Error(
      "Invalid twill input. Please input 'tartan', 'madras', or 'net'"
    );
  }

  return twillMap[twill];
}

function createMask(size: number, pattern: TwillPattern): NDArray {
  const numOfPattern = Math.ceil(size / pattern.length);
  const mask = tile(pack(pattern), [numOfPattern, numOfPattern]);

  return mask;
}

function applyTwill(
  size: number,
  rotatedWrap: NDArray,
  mask: NDArray,
  wrap: NDArray
): NDArray {
  // Apply twill pattern
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (mask.get(i, j) === 1) {
        wrap.set(i, j, 0, rotatedWrap.get(i, j, 0));
        wrap.set(i, j, 1, rotatedWrap.get(i, j, 1));
        wrap.set(i, j, 2, rotatedWrap.get(i, j, 2));
      }
    }
  }

  // Create  plaid
  const plaid = ndarray(wrap.data, [size, size, 3]);


  return plaid;
}

export default generatePlaid;
