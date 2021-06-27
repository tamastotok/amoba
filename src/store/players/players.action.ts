import {
  SET_PLAYER_BLUE_NAME,
  SET_PLAYER_RED_NAME,
} from '../../utils/constants';

export const setPlayerBlueName = (name: string) => {
  return {
    type: SET_PLAYER_BLUE_NAME,
    payload: name,
  };
};

export const setPlayerRedName = (name: string) => {
  return {
    type: SET_PLAYER_RED_NAME,
    payload: name,
  };
};
