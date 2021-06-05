import {
  SELECT_STARTER_MARK,
  SET_NEXT_MARK,
  RESET_NEXT_MARK,
} from '../constants';
import { Marks, MarkAction } from '../types/marks';

const initialState: Marks = {
  starterMark: 'X',
  nextMark: 'X',
};

const marksReducer = (state = initialState, action: MarkAction) => {
  switch (action.type) {
    case SELECT_STARTER_MARK:
      return {
        ...state,
        starterMark: action.payload,
        nextMark: action.payload,
      };
    case SET_NEXT_MARK:
      return {
        ...state,
        nextMark: state.nextMark === 'X' ? 'O' : 'X',
      };
    case RESET_NEXT_MARK:
      return {
        ...state,
        nextMark: action.payload,
      };
    default:
      return state;
  }
};

export default marksReducer;
