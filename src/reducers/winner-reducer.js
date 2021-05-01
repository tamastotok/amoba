import { SET_WINNER } from "../constants";

const winnerReducer = (state = "", action) => {
  switch (action.type) {
    case SET_WINNER:
      return action.payload;

    default:
      return state;
  }
};

export default winnerReducer;
