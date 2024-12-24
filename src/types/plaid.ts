export interface PlaidOptions {
  colors: number[][];
  size: number;
  twill: 'tartan' | 'madras' | 'net';
  pivots: number[][];
}

export type TwillPattern = number[][];
export type NDArray = {
  data: Float64Array;
  get: (i: number, j: number, k?: number) => number;
  set: (i: number, j: number, k?: number, value?: number) => void;
}; 