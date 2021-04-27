import { SET_ID, SET_VALUE } from "../constants";

const initialState = {
  id: "",
  value: "",
};

const squareReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ID:
      return {
        ...state,
        id: action.payload,
      };
    case SET_VALUE:
      return {
        ...state,
        value: action.payload,
      };
    default:
      return state;
  }
};

export default squareReducer;
