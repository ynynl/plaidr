const ndarray = require("ndarray");
const tile = require("ndarray-tile");
const pack = require("ndarray-pack");
const unpack = require("ndarray-unpack");

/**
 * Generate a plaid pattern
 * @param {Object} options - The options object
 * @param {Array} options.colors - The colors of the plaid
 * @param {number} options.size - The size of the plaid, must be a multiple of 4
 * @param {string} options.twill - The twill pattern of the plaid, can only be "tartan", "madras", or "net"
 * @param {Array} options.pivots - The pivots of the plaid
 * @returns {Array} - The generated plaid pattern
 */

function generatePlaid({
  colors,
  size,
  twill,
  pivots
}) {
  if (size % 4 !== 0) {
    throw new Error("Invalid size input. Please input a multiple of 4");
  }

  console.log({
    colors,
    size,
    twill,
    pivots
  });

  const numOfBand = colors.length - 1;
  const sett = ndarray(new Float64Array(size * 3), [size, 3]);
  const background = colors[colors.length - 1];

  // Set background color
  for (let i = 0; i < size; ++i) {
    sett.set(i, 0, background[0]);
    sett.set(i, 1, background[1]);
    sett.set(i, 2, background[2]);
  }

  // Set thread colors
  const threads = pivots.map((pivot) => [
    Math.floor(pivot[0] * size),
    Math.floor(pivot[1] * size),
  ]);

  for (let colorIndex = 0; colorIndex < numOfBand; ++colorIndex) {
    for (let j = threads[colorIndex][0]; j < threads[colorIndex][1]; ++j) {
      sett.set(j, 0, colors[colorIndex][0]);
      sett.set(j, 1, colors[colorIndex][1]);
      sett.set(j, 2, colors[colorIndex][2]);
    }
  }

  // Create wrap
  const tiledWrap = tile(sett, [size, 1, 1]);
  const wrap = ndarray(tiledWrap.data, [size, size, 3]);

  // Create twill pattern
  const twillMap = {
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
    throw new Error("Invalid twill input. Please input 'tartan', 'madras', or 'net'");
  }

  const pattern = twillMap[twill];
  const numOfPattern = Math.ceil(size / pattern.length);
  const mask = tile(pack(pattern), [numOfPattern, numOfPattern]);

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

  // Unpack plaid
  const plaid = ndarray(wrap.data, [size, size, 3]);
  const unpackedPlaid = unpack(plaid);

  return unpackedPlaid;
}

export default generatePlaid;

