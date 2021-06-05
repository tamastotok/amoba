import { SET_GRID_SIZE } from '../constants';
import { GridSizeAction } from '../types/grid-size';

const gridSizeReducer = (state: number = 8, action: GridSizeAction) => {
  switch (action.type) {
    case SET_GRID_SIZE:
      return action.payload;

    default:
      return state;
  }
};

export default gridSizeReducer;
