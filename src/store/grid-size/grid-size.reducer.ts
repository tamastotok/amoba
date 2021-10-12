import { SET_GRID_SIZE } from '../../utils/constants';
import { Action } from '../../types';

const gridSizeReducer = (state: number = 0, action: Action<number>) => {
  switch (action.type) {
    case SET_GRID_SIZE:
      return action.payload;

    default:
      return state;
  }
};

export default gridSizeReducer;
