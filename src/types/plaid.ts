export interface PlaidOptions {
  colors: number[][];
  size: number;
  twill: 'tartan' | 'madras' | 'net';
  pivots: number[][];
}

export type TwillPattern = number[][];
export interface NDArray {
  data: Float64Array | Float32Array;
  shape: number[];
  stride?: number[];
  offset?: number;
  pick: (...args: (number | null)[]) => NDArray;
  step: (dir: number) => NDArray;
  transpose: (a: number, b: number) => NDArray;
  get: (...args: number[]) => number;
  set: (...args: number[]) => void;
} 