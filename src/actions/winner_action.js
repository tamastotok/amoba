import { SET_WINNER } from "../constants";

export const setWinner = (winner) => {
  return {
    type: SET_WINNER,
    payload: winner,
  };
};
