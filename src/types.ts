export type DefaultMark = 'X' | 'O';
export type Mark = 'X' | 'O';
export type Cell = Mark | '';
export type Board = Cell[][];

interface SinglePlayer {
  name: string;
  mark: DefaultMark;
}

export interface Players {
  blue: SinglePlayer;
  red: SinglePlayer;
}

export interface Marks {
  starterMark: DefaultMark;
  nextMark: DefaultMark;
  playerMark: DefaultMark;
}

//  Default Redux Action
export interface Action<T = unknown> {
  type: string;
  payload: T;
}

export interface Reducers {
  players: Players;
  marks: Marks;
  square: Board;
  gridSize: number;
  winner: string;
  gridIsDisabled: boolean;
}

export interface SearchingPayload {
  playerMark: string;
  starterMark: string;
}

export interface GameFoundPayload {
  roomId: string;
  playerData: {
    blueName: string;
    redName: string;
  };
}

export interface ContinuePayload {
  boardSize: number;
  bluePlayer: { name: string };
  redPlayer: { name: string };
  whoIsNext: string;
  roomId: string;
  positions: Array<{ row: number; col: number; value: string }>;
}
