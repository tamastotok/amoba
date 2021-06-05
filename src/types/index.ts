import { Players } from './players';
import { Squares } from './square';
import { Marks } from './marks';

export interface Reducers {
  players: Players;
  gridSize: number;
  square: Squares;
  marks: Marks;
  winner: string;
  gridIsDisabled: boolean;
}
