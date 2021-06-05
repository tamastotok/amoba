import { SET_PLAYER_BLUE_NAME, SET_PLAYER_RED_NAME } from '../constants';
import { Players, PlayerAction } from '../types/players';

const initialState: Players = {
  blue: {
    id: 1,
    name: '',
    mark: 'X',
  },
  red: {
    id: 2,
    name: '',
    mark: 'O',
  },
};

const playersReducer = (state = initialState, action: PlayerAction) => {
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
