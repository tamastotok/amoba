import type { Mark, Sqr } from './game';

export interface SearchingPayload {
  playerMark: Mark;
  starterMark: Mark;
}

export interface GameFoundPayload {
  roomId: string;
  boardSize: number;
  starterMark: Mark;
  playerData: {
    blueName: string;
    redName: string;
  };
}

export interface ContinuePayload {
  boardSize: number;
  bluePlayer: { name: string };
  redPlayer: { name: string };
  whoIsNext: Mark;
  roomId: string;
  positions: Sqr[];
}

export interface OpponentLeftPayload {
  message: string;
  roomId: string;
}
