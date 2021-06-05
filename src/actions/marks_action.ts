import {
  SELECT_STARTER_MARK,
  SET_NEXT_MARK,
  RESET_NEXT_MARK,
} from '../constants';

export const selectStarterMark = (value: string) => {
  return {
    type: SELECT_STARTER_MARK,
    payload: value,
  };
};

export const setNextMark = () => {
  return {
    type: SET_NEXT_MARK,
  };
};

export const resetNextMark = (value: string) => {
  return {
    type: RESET_NEXT_MARK,
    payload: value,
  };
};