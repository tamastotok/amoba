import { SET_NAME, SET_SYMBOL } from "../constants";

export const setName = (name) => {
  return {
    type: SET_NAME,
    payload: name,
  };
};

export const setSymbol = (symbol) => {
  return {
    type: SET_SYMBOL,
    payload: symbol,
  };
};
