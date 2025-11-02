import {
  SELECT_STARTER_MARK,
  SET_NEXT_MARK,
  RESET_NEXT_MARK,
  SELECT_PLAYER_MARK,
} from '@/utils/constants';
import type { PlayerMarks, Action } from '@/types';

const initialState: PlayerMarks = {
  starterMark: 'X',
  nextMark: 'X',
  playerMark: 'X',
};

const marksReducer = (state = initialState, action: Action<PlayerMarks>) => {
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
    case SELECT_PLAYER_MARK:
      return {
        ...state,
        playerMark: action.payload,
      };
    default:
      return state;
  }
};

export default marksReducer;
