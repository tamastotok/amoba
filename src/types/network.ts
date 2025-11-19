import type { Mark, Sqr } from './game';

export interface SearchingPayload {
  playerMark: Mark;
  starterMark: Mark;
}

export interface GameFoundPayload {
  roomId: string;
  boardSize: number;
  starterMark: Mark;
  playerMark: Mark;
  playerData: {
    bluePlayer: { name: string };
    redPlayer: { name: string };
  };
  positions: Sqr[];
  isReconnect: boolean;
}

export interface ContinuePayload {
  roomId: string;
  boardSize: number;
  playerData: {
    bluePlayer: {
      name: string;
      mark: Mark;
    };
    redPlayer: {
      name: string;
      mark: Mark;
    };
  };
  positions: Sqr[];
  nextMark: Mark;
  isReconnect: boolean;
}

export interface OpponentLeftPayload {
  message: string;
  roomId: string;
  reconnectWindow?: number;
}
