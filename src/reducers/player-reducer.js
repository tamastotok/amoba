import { SET_NAME, SET_SYMBOL } from "../constants";

const initialState = {
  name: "",
  symbol: "",
};

const playerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NAME:
      return {
        ...state,
        name: action.payload,
      };
    case SET_SYMBOL:
      return {
        ...state,
        symbol: action.payload,
      };
    default:
      return state;
  }
};

export default playerReducer;
