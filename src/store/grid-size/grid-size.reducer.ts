import { RESET_GAME_STATE, SET_GRID_SIZE } from '@/utils/constants';
import type { Action } from '@/types';

const initialState = 8;

const gridSizeReducer = (
  state: number = initialState,
  action: Action<number>
) => {
  switch (action.type) {
    case SET_GRID_SIZE:
      return action.payload;
    case RESET_GAME_STATE:
      return initialState;

    default:
      return state;
  }
};

export default gridSizeReducer;
