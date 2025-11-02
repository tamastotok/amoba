import { SET_DRAW } from '@/utils/constants';

export const setDraw = (gameIsDraw: boolean) => {
  return {
    type: SET_DRAW as typeof SET_DRAW,
    payload: gameIsDraw,
  };
};
