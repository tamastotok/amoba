import { SET_SQUARE_DATA } from '../../utils/constants';

export const setSquareData = (row: number, col: number, value: string) => {
  return {
    type: SET_SQUARE_DATA,
    row: row,
    col: col,
    value: value,
  };
};
