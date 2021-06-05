import { SET_WINNER } from '../constants';

export const setWinner = (winner: string) => {
  return {
    type: SET_WINNER,
    payload: winner,
  };
};
