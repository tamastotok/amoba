import { SET_WINNER } from '../constants';
import { WinnerAction } from '../types/winner';

const winnerReducer = (state: string = '', action: WinnerAction) => {
  switch (action.type) {
    case SET_WINNER:
      return action.payload;

    default:
      return state;
  }
};

export default winnerReducer;
