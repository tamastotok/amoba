import {
  SELECT_STARTER_SYMBOL,
  SET_NEXT_SYMBOL,
  RESET_NEXT_SYMBOL,
} from "../constants";

export const selectStarterSymbol = (value) => {
  return {
    type: SELECT_STARTER_SYMBOL,
    payload: value,
  };
};

export const setNextSymbol = () => {
  return {
    type: SET_NEXT_SYMBOL,
  };
};

export const resetNextSymbol = (value) => {
  return {
    type: RESET_NEXT_SYMBOL,
    payload: value,
  };
};
