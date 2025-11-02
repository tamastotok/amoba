import { SET_PLAYER_BLUE_NAME, SET_PLAYER_RED_NAME } from '@/utils/constants';
import type { Players, Action } from '@/types';

const initialState: Players = {
  blue: {
    name: '',
    mark: 'X',
  },
  red: {
    name: '',
    mark: 'O',
  },
};

const playersReducer = (state = initialState, action: Action<string>) => {
  switch (action.type) {
    case SET_PLAYER_BLUE_NAME:
      return {
        ...state,
        blue: {
          ...state.blue,
          name: action.payload,
        },
      };
    case SET_PLAYER_RED_NAME:
      return {
        ...state,
        red: {
          ...state.red,
          name: action.payload,
        },
      };
    default:
      return state;
  }
};

export default playersReducer;
