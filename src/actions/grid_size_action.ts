import { SET_GRID_SIZE } from '../constants';

export const setGridSize = (size: number) => {
  return {
    type: SET_GRID_SIZE,
    payload: size,
  };
};
