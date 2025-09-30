import { SET_GRID_SIZE } from '../../utils/constants';
import type { Action } from '../../types';

const initialState = 8;

const gridSizeReducer = (
  state: number = initialState,
  action: Action<number>
) => {
  switch (action.type) {
    case SET_GRID_SIZE:
      return action.payload;

    default:
      return state;
  }
};

export default gridSizeReducer;
