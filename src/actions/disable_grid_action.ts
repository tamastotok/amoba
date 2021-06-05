import { DISABLE_GRID, CHANGE_GRID_STATE } from '../constants';

export const setGridIsDisabled = (bool: boolean) => {
  return {
    type: DISABLE_GRID,
    payload: bool,
  };
};

export const changeGridState = () => {
  return {
    type: CHANGE_GRID_STATE,
  };
};
