declare module 'ndarray-tile' {
  import { NdArray } from 'ndarray';
  function tile(array: NdArray, shape: number[]): NdArray;
  export default tile;
} 