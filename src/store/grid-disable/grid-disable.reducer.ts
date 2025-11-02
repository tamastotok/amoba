import { CHANGE_GRID_STATE, DISABLE_GRID } from '@/utils/constants';
import type { Action } from '@/types';

const gridIsDisabledReducer = (
  state: boolean = false,
  action: Action<boolean>
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
