//  Initial State
export interface Players {
  blue: SinglePlayer;
  red: SinglePlayer;
}

interface SinglePlayer {
  id: number;
  name: string;
  mark: string;
}

//  Reducer Action
export interface PlayerAction {
  type: string;
  payload: string;
}
