import { RESET_GAME_STATE } from '@/utils/constants';

export const resetGameState = () => ({
  type: RESET_GAME_STATE as typeof RESET_GAME_STATE,
});
