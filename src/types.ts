export interface PlaidSettings {
  colors: number[][];
  size: number;
  twill: 'tartan' | 'madras' | 'net';
  pivots: number[][];
}

export interface LikedPlaid extends PlaidSettings {
  id: number;
  src: string;
} 