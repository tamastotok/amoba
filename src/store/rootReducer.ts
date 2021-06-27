import { combineReducers } from 'redux';
import playersReducer from './players/players.reducer';
import squareReducer from './square/square.reducer';
import marksReducer from './marks/marks.reducer';
import winnerReducer from './winner/winner.reducer';
import gridSizeReducer from './grid-size/grid-size.reducer';
import gridIsDisabledReducer from './grid-disable/grid-disable.reducer';
import { Reducers } from '../types';

const reducers: Reducers = combineReducers({
  players: playersReducer,
  gridSize: gridSizeReducer,
  square: squareReducer,
  marks: marksReducer,
  winner: winnerReducer,
  gridIsDisabled: gridIsDisabledReducer,
}) as any;

export default reducers;
