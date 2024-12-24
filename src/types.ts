export interface PlaidSettings {
  colors: number[][];
  size: number;
  twill: string;
  pivots: number[][];
}

export interface LikedPlaid extends PlaidSettings {
  id: number;
  src: string;
} 