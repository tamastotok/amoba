import type { Mark } from './game';

export interface SinglePlayer {
  name: string;
  mark: Mark;
}

export interface Players {
  blue: SinglePlayer;
  red: SinglePlayer;
}

export interface PlayerMarks {
  starterMark: Mark;
  nextMark: Mark;
  playerMark: Mark;
}
