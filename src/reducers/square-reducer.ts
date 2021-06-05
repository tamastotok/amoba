import { SET_SQUARE_DATA } from '../constants';
import { Squares, SquareAction } from '../types/square';

const initialState: Squares = {
  row: 0,
  col: 0,
  value: '',
};

const squareReducer = (state = initialState, action: SquareAction) => {
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
