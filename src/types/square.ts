//  Initial State
export interface Squares {
  row: number;
  col: number;
  value: string;
}

//  Redux Action
export interface SquareAction {
  type: string;
  row: number;
  col: number;
  value: string;
}
