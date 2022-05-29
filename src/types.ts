type DefaultMark = 'X' | 'O';

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

export interface Square {
  row: number;
  col: number;
  value: string;
}

//  Default Redux Action
export interface Action<Type> extends Square {
  type: string;
  payload: Type;
}

//  CombineReducer
export interface Reducers {
  players: Players;
  marks: Marks;
  square: Square;
  gridSize: number;
  winner: string;
  gridIsDisabled: boolean;
}
