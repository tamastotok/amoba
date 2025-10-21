import { SET_DRAW } from '../../utils/constants';

export const setDraw = (isDraw: boolean) => {
  return {
    type: SET_DRAW,
    payload: isDraw,
  };
};
