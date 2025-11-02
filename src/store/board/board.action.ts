import { SET_BOARD_DATA, HYDRATE_BOARD } from '@/utils/constants';
import type { Sqr } from '@/types';

export const setBoardData = (square: Sqr) => ({
  type: SET_BOARD_DATA as typeof SET_BOARD_DATA,
  payload: square,
});

export const hydrateBoard = (size: number, positions: Sqr[]) => ({
  type: HYDRATE_BOARD as typeof HYDRATE_BOARD,
  payload: { size, positions },
});
