import type { Players, PlayerMarks } from './player';
import type { Board } from './game';

export interface Action<T = unknown> {
  type: string;
  payload: T;
}

export interface Reducers {
  players: Players;
  marks: PlayerMarks;
  board: Board;
  gridSize: number;
  winner: string;
  gridIsDisabled: boolean;
  gameIsDraw: boolean;
}
