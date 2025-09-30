import { combineReducers } from 'redux';
import playersReducer from './players/players.reducer';
import boardReducer from './board/board.reducer';
import marksReducer from './marks/marks.reducer';
import winnerReducer from './winner/winner.reducer';
import gridSizeReducer from './grid-size/grid-size.reducer';
import gridIsDisabledReducer from './grid-disable/grid-disable.reducer';

const rootReducer = combineReducers({
  players: playersReducer,
  gridSize: gridSizeReducer,
  board: boardReducer,
  marks: marksReducer,
  winner: winnerReducer,
  gridIsDisabled: gridIsDisabledReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
