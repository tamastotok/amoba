import { SET_PLAYER_BLUE_NAME, SET_PLAYER_RED_NAME } from "../constants";

export const setPlayerBlueName = (name) => {
  return {
    type: SET_PLAYER_BLUE_NAME,
    payload: name,
  };
};

export const setPlayerRedName = (name) => {
  return {
    type: SET_PLAYER_RED_NAME,
    payload: name,
  };
};
