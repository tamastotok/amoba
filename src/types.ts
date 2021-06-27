interface SinglePlayer {
  name: string;
  mark: string;
}

export interface Players {
  blue: SinglePlayer;
  red: SinglePlayer;
}

export interface Marks {
  starterMark: string;
  nextMark: string;
  playerMark: string;
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
