const ndarray = require("ndarray");
const show = require("ndarray-show");
const tile = require("ndarray-tile");
const pack = require("ndarray-pack");
const unpack = require("ndarray-unpack");

export function randomPivots(length) {
  const randomN2 = Array.from({ length }, () => {
    const pair = [Math.random(), Math.random()];
    return pair.sort();
  });
  return randomN2.sort((a, b) => Math.abs(b[0] - b[1]) - Math.abs(a[0] - a[1]));
}

function assignColorfrom2dArray(sett, i, color) {
  sett.set(i, 0, color[0]);
  sett.set(i, 1, color[1]);
  sett.set(i, 2, color[2]);
}

function assignColorfrom3dNdArray(wrap, i, color) {
  sett.set(i, 0, color[0]);
  sett.set(i, 1, color[1]);
  sett.set(i, 2, color[2]);
}

const generate = ({ colors, size, twill }) => {
  console.log('colors', colors);
  const numOfBand = colors.length - 1;
  let sett = ndarray(new Float64Array(size * 3), [size, 3]);


  const background = colors.pop();

  for (let i = 0; i < size; ++i) {
    assignColorfrom2dArray(sett, i, background);
  }

  const pivots = randomPivots(numOfBand);

  const threads = pivots.map((pivot) => [
    Math.floor(pivot[0] * size),
    Math.floor(pivot[1] * size),
  ]);

  console.log(threads);

  for (let colorIndex = 0; colorIndex < numOfBand; ++colorIndex) {
    for (let j = threads[colorIndex][0]; j < threads[colorIndex][1]; ++j) {
      assignColorfrom2dArray(sett, j, colors[colorIndex]);
    }
  }



  const wrapRep = tile(sett, [size, 1, 1]);
  const wrap = ndarray(wrapRep.data, [size, size, 3])


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
    ]
  };

  const pattern = twillMap[twill];

  const numOfPattern = Math.ceil(size / pattern.length);

  const mask = tile(pack(pattern), [numOfPattern, numOfPattern]);

  const rotatedWrap = ndarray(new Float64Array(size * size * 3), [size, size, 3]);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      rotatedWrap.set(i, j, 0, wrap.get(size - j - 1, i, 0));
      rotatedWrap.set(i, j, 1, wrap.get(size - j - 1, i, 1));
      rotatedWrap.set(i, j, 2, wrap.get(size - j - 1, i, 2));
    }
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (mask.get(i, j) === 1) {
        wrap.set(i, j, 0, rotatedWrap.get(i, j, 0));
        wrap.set(i, j, 1, rotatedWrap.get(i, j, 1));
        wrap.set(i, j, 2, rotatedWrap.get(i, j, 2));
      }
    }
  }

  const plaid = ndarray(wrap.data, [size, size, 3])

  const unpackedPlaid = unpack(plaid)

  return unpackedPlaid;
};

export default generate;

