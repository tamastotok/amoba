import { SET_SQUARE_INDEX, SET_SQUARE_VALUE } from "../constants";

const initialState = {
  index: "",
  value: "",
};

const squareReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SQUARE_INDEX:
      return {
        ...state,
        index: action.payload,
      };
    case SET_SQUARE_VALUE:
      return {
        ...state,
        value: action.payload,
      };
    default:
      return state;
  }
};

export default squareReducer;
