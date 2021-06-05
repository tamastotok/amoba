import { CHANGE_GRID_STATE, DISABLE_GRID } from '../constants';
import { DisableGridAction } from '../types/disable-grid';

const gridIsDisabledReducer = (
  state: boolean = false,
  action: DisableGridAction
) => {
  switch (action.type) {
    case DISABLE_GRID:
      return action.payload;

    case CHANGE_GRID_STATE:
      return !state;

    default:
      return state;
  }
};

export default gridIsDisabledReducer;
