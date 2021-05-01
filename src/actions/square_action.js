import { SET_SQUARE_INDEX, SET_SQUARE_VALUE } from "../constants";

export const setSquareIndex = (index) => {
  return {
    type: SET_SQUARE_INDEX,
    payload: index,
  };
};

export const setSquareValue = (value) => {
  return {
    type: SET_SQUARE_VALUE,
    payload: value,
  };
};
