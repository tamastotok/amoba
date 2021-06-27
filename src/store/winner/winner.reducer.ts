import { SET_WINNER } from '../../utils/constants';
import { Action } from '../../types';

const winnerReducer = (state: string = '', action: Action<string>) => {
  switch (action.type) {
    case SET_WINNER:
      return action.payload;

    default:
      return state;
  }
};

export default winnerReducer;
