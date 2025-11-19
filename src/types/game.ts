export type Mark = 'X' | 'O';
export type Cell = Mark | '';
export type Board = Cell[][];

export interface GameState {
  gridSize: number;
  board: Board;
  winner: string;
  gridIsDisabled: boolean;
  gameIsDraw: boolean;
}

export interface Sqr {
  row: number;
  col: number;
  value: Cell;
}

export interface OnlineGameProps {
  playerMark: Mark;
  roomId: string;
}

export interface Coord {
  row: number;
  col: number;
}

export interface Direction {
  dRow: number;
  dCol: number;
}

export interface MoveContext extends Coord, Direction {
  board: Board;
  mark: Mark;
}
