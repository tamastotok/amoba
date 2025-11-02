import {
  SELECT_STARTER_MARK,
  SET_NEXT_MARK,
  RESET_NEXT_MARK,
  SELECT_PLAYER_MARK,
} from '@/utils/constants';

export const selectStarterMark = (value: string) => {
  return {
    type: SELECT_STARTER_MARK as typeof SELECT_STARTER_MARK,
    payload: value,
  };
};

export const setNextMark = () => {
  return {
    type: SET_NEXT_MARK as typeof SET_NEXT_MARK,
  };
};

export const resetNextMark = (value: string) => {
  return {
    type: RESET_NEXT_MARK as typeof RESET_NEXT_MARK,
    payload: value,
  };
};

export const selectPlayerMark = (value: string) => {
  return {
    type: SELECT_PLAYER_MARK as typeof SELECT_PLAYER_MARK,
    payload: value,
  };
};
