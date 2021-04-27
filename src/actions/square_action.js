import { SET_ID, SET_VALUE } from "../constants";

export const setId = (id) => {
  return {
    type: SET_ID,
    payload: id,
  };
};

export const setValue = (value) => {
  return {
    type: SET_VALUE,
    payload: value,
  };
};
