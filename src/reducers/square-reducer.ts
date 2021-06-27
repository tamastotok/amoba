import { SET_SQUARE_DATA } from '../constants';
import { Square, Action } from '../types';

const initialState: Square = {
  row: 0,
  col: 0,
  value: '',
};

const squareReducer = (state = initialState, action: Action<string>) => {
  switch (action.type) {
    case SET_SQUARE_DATA:
      return {
        ...state,
        row: action.row,
        col: action.col,
        value: action.value,
      };
    default:
      return state;
  }
};

export default squareReducer;
