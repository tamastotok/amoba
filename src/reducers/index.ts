import { combineReducers } from 'redux';
import playersReducer from './players-reducer';
import squareReducer from './square-reducer';
import marksReducer from './marks-reducer';
import winnerReducer from './winner-reducer';
import gridSizeReducer from './grid-size-reducer';
import gridIsDisabledReducer from './disable-grid-reducer';
import { Reducers } from '../types/';

const reducers: Reducers | any = combineReducers({
  players: playersReducer,
  gridSize: gridSizeReducer,
  square: squareReducer,
  marks: marksReducer,
  winner: winnerReducer,
  gridIsDisabled: gridIsDisabledReducer,
});

export default reducers;
