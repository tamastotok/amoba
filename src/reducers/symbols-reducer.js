import {
  SELECT_STARTER_SYMBOL,
  SET_NEXT_SYMBOL,
  RESET_NEXT_SYMBOL,
} from "../constants";

const initialState = {
  starterSymbol: "",
  nextSymbol: "",
};

const symbolsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_STARTER_SYMBOL:
      return {
        ...state,
        starterSymbol: action.payload,
        nextSymbol: action.payload,
      };
    case SET_NEXT_SYMBOL:
      return {
        ...state,
        nextSymbol: state.nextSymbol === "X" ? "O" : "X",
      };
    case RESET_NEXT_SYMBOL:
      return {
        ...state,
        nextSymbol: action.payload,
      };
    default:
      return state;
  }
};

export default symbolsReducer;
