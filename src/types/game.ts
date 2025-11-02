import type { ContinuePayload } from './network';

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
  response: ContinuePayload | null;
  playerMark: Mark;
  roomId: string;
  clientIsReloaded: boolean;
}
