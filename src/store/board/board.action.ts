import { SET_BOARD_DATA, HYDRATE_BOARD } from '../../utils/constants';
import type { Mark } from '../../types';

export const setBoardData = (row: number, col: number, value: Mark) => ({
  type: SET_BOARD_DATA,
  payload: { row, col, value },
});

export const hydrateBoard = (
  size: number,
  positions: Array<{ row: number; col: number; value: string }>
) => ({
  type: HYDRATE_BOARD,
  payload: {
    size,
    positions: positions.map((p) => ({
      ...p,
      value: (p.value === 'X' || p.value === 'O' ? p.value : '') as Mark,
    })),
  },
});
