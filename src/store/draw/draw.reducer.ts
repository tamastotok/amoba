import { SET_DRAW } from '@/utils/constants';
import type { Action } from '@/types';

const drawReducer = (state = false, action: Action<boolean>) => {
  switch (action.type) {
    case SET_DRAW:
      return action.payload;
    default:
      return state;
  }
};

export default drawReducer;
