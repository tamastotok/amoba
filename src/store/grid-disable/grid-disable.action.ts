import { DISABLE_GRID, CHANGE_GRID_STATE } from '../../utils/constants';

export const setGridIsDisabled = (bool: boolean) => {
  return {
    type: DISABLE_GRID as typeof DISABLE_GRID,
    payload: bool,
  };
};

export const changeGridState = () => {
  return {
    type: CHANGE_GRID_STATE as typeof CHANGE_GRID_STATE,
  };
};
