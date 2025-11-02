import { SET_WINNER } from '@/utils/constants';

export const setWinner = (winner: string) => {
  return {
    type: SET_WINNER as typeof SET_WINNER,
    payload: winner,
  };
};
