import { combineReducers } from 'redux';
import { RESET_GAME_STATE } from '../utils/constants';
import playersReducer from './players/players.reducer';
import boardReducer from './board/board.reducer';
import marksReducer from './marks/marks.reducer';
import winnerReducer from './winner/winner.reducer';
import drawReducer from './draw/draw.reducer';
import gridSizeReducer from './grid-size/grid-size.reducer';
import gridIsDisabledReducer from './grid-disable/grid-disable.reducer';
import type { Action } from '../types';

const appReducer = combineReducers({
  players: playersReducer,
  gridSize: gridSizeReducer,
  board: boardReducer,
  marks: marksReducer,
  winner: winnerReducer,
  isDraw: drawReducer,
  gridIsDisabled: gridIsDisabledReducer,
});

// Reset game state globally
const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: Action<string>
) => {
  if (action.type === RESET_GAME_STATE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
